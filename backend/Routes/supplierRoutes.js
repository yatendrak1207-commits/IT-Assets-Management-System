const express = require("express"); 
const router = express.Router(); 
 
const Supplier = require("../Models/Supplier"); 
const Asset = require("../Models/Asset"); 
const { isValidPhoneNumber } = require("libphonenumber-js"); 
 
// ================= GET ================= 
 
router.get("/", async function (req, res) { 
 
    try { 
 
        const suppliers = await Supplier.find(); 
 
        const suppliersWithAssets = await Promise.all( 
            suppliers.map(async function (supplier) { 
 
                const assets = await Asset.find({ 
                    supplier: supplier._id 
                }).select( 
                    "id assetId assetName category status assignedTo" 
                ); 
 
                return { 
                    ...supplier.toObject(), 
                    suppliedAssets: assets, 
                    suppliedAssetsCount: assets.length 
                }; 
 
            }) 
        ); 
 
        res.json(suppliersWithAssets); 
 
    } catch (error) { 
 
        res.status(500).json({ 
            message: "Failed to fetch supplier", 
            error: error 
        }); 
 
    } 
 
}); 
 
// ================= POST ================= 
 
router.post("/", async function (req, res) { 
 
    try { 
 
        const { 
            id, 
            supplierName, 
            companyName, 
            companyContactNumber, 
            companyEmail, 
            companyAddress, 
            assetsSupplied, 
            supplierStatus 
        } = req.body; 
 
        // Required fields 
 
        if ( 
            id === undefined || 
            !supplierName || 
            !companyName || 
            !companyContactNumber || 
            !companyEmail || 
            !companyAddress || 
            !assetsSupplied || 
            !supplierStatus 
        ) { 
 
            return res.status(400).json({ 
                message: "All supplier fields are required" 
            }); 
 
        } 
 
        // Internal ID validation 
 
        if (typeof id !== "number") { 
 
            return res.status(400).json({ 
                message: "ID must be a number" 
            }); 
 
        } 
 
        // Phone validation 
 
        const fullPhoneNumber = 
            companyContactNumber.replace(/\s/g, ""); 
 
        if (!isValidPhoneNumber(fullPhoneNumber)) { 
 
            return res.status(400).json({ 
                message: "Invalid phone number for selected country" 
            }); 
 
        } 
 
        // Duplicate internal ID 
 
        const existingId = await Supplier.findOne({ 
            id: id 
        }); 
 
        if (existingId) { 
 
            return res.status(409).json({ 
                message: "Internal ID already exists" 
            }); 
 
        } 
 
        // ================= AUTO SUPPLIER ID ================= 
 
        const lastSupplier = await Supplier.findOne({ 
            supplierId: /^SUP\d+$/ 
        }).sort({ 
            supplierId: -1 
        }); 
 
        let nextNumber = 1; 
 
        if (lastSupplier) { 
 
            const lastNumber = Number( 
                lastSupplier.supplierId.replace("SUP", "") 
            ); 
 
            nextNumber = lastNumber + 1; 
 
        } 
 
        const supplierId = 
            "SUP" + String(nextNumber).padStart(3, "0"); 
 
        // ================= CREATE ================= 
 
        const newSupplier = new Supplier({ 
 
            id: id, 
 
            supplierId: supplierId, 
 
            supplierName: supplierName, 
 
            companyName: companyName, 
 
            companyContactNumber: companyContactNumber, 
 
            companyEmail: companyEmail, 
 
            companyAddress: companyAddress, 
 
            assetsSupplied: assetsSupplied, 
 
            supplierStatus: supplierStatus 
 
        }); 
 
        const supplier = await newSupplier.save(); 
 
        res.status(201).json(supplier); 
 
    } catch (error) { 
 
        res.status(500).json({ 
            message: "Failed to create supplier", 
            error: error 
        }); 
 
    } 
 
}); 
 
// ================= PUT ================= 
 
router.put("/:id", async function (req, res) { 
 
    try { 
 
        const id = Number(req.params.id); 
 
        if (isNaN(id)) { 
 
            return res.status(400).json({ 
                message: "id must be a number" 
            }); 
 
        } 
 
        const supplier = await Supplier.findOne({ 
            id: id 
        }); 
 
        if (!supplier) { 
 
            return res.status(404).json({ 
                message: "Supplier not found" 
            }); 
 
        } 
 
        // supplierId intentionally NOT updated 
 
        if (req.body.supplierName !== undefined) { 
 
            supplier.supplierName = 
                req.body.supplierName; 
 
        } 
 
        if (req.body.companyName !== undefined) { 
 
            supplier.companyName = 
                req.body.companyName; 
 
        } 
 
        if (req.body.companyContactNumber !== undefined) { 
 
            const fullPhoneNumber = 
                req.body.companyContactNumber.replace(/\s/g, ""); 
 
            if (!isValidPhoneNumber(fullPhoneNumber)) { 
 
                return res.status(400).json({ 
                    message: "Invalid phone number for selected country" 
                }); 
 
            } 
 
            supplier.companyContactNumber = 
                req.body.companyContactNumber; 
 
        } 
 
        if (req.body.companyEmail !== undefined) { 
 
            supplier.companyEmail = 
                req.body.companyEmail; 
 
        } 
 
        if (req.body.companyAddress !== undefined) { 
 
            supplier.companyAddress = 
                req.body.companyAddress; 
 
        } 
 
        if (req.body.assetsSupplied !== undefined) { 
 
            supplier.assetsSupplied = 
                req.body.assetsSupplied; 
 
        } 
 
        if (req.body.supplierStatus !== undefined) { 
 
            supplier.supplierStatus = 
                req.body.supplierStatus; 
 
        } 
 
        const updatedSupplier = 
            await supplier.save(); 
 
        res.json(updatedSupplier); 
 
    } catch (error) { 
 
        res.status(500).json({ 
            message: "Failed to update supplier", 
            error: error 
        }); 
 
    } 
 
}); 
 
// ================= DELETE ================= 
 
router.delete("/:id", async function (req, res) { 
 
    const id = Number(req.params.id); 
 
    try { 
 
        const supplier = await Supplier.findOne({ 
            id: id 
        }); 
 
        if (!supplier) { 
 
            return res.status(404).json({ 
                message: "Supplier not found" 
            }); 
 
        } 
 
        // Remove supplier connection from its assets 
        await Asset.updateMany( 
            { supplier: supplier._id }, 
            { $set: { supplier: null } } 
        ); 
 
        await supplier.deleteOne(); 
 
        res.json({ 
            message: "Supplier deleted successfully" 
        }); 
 
    } catch (error) { 
 
        res.status(500).json({ 
            message: "Failed to delete supplier", 
            error: error 
        }); 
 
    } 
 
}); 
 
module.exports = router;