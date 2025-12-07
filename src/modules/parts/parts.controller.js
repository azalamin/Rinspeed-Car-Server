const { ObjectId } = require("mongodb");

exports.listParts = async (req, res, db) => {
    try {
        const parts = await db.collection("parts").find().toArray();

        // Must return ARRAY only ✔
        return res.status(200).json(parts);

    } catch (err) {
        console.error("Parts List Error:", err);
        return res.status(500).json({ message: "Server error loading parts" });
    }
};

exports.getPart = async (req, res, db) => {
    try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const part = await db.collection("parts").findOne({ _id: new ObjectId(id) });

        if (!part) {
            return res.status(404).json({ message: "Part not found" });
        }

        // Must return ONE object ✔
        return res.status(200).json(part);

    } catch (err) {
        console.error("Part Fetch Error:", err);
        return res.status(500).json({ message: "Server error loading part" });
    }
};

exports.createPart = async (req, res, db) => {
    try {
        const result = await db.collection("parts").insertOne(req.body);
        return res.status(201).json({ insertedId: result.insertedId });
    } catch (err) {
        console.error("Create Part Error:", err);
        return res.status(500).json({ message: "Server error adding part" });
    }
};

exports.deletePart = async (req, res, db) => {
    try {
        const { partId } = req.params;

        if (!ObjectId.isValid(partId)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const result = await db.collection("parts").deleteOne({
            _id: new ObjectId(partId),
        });

        return res.status(200).json({ deleted: result.deletedCount > 0 });

    } catch (err) {
        console.error("Delete Part Error:", err);
        return res.status(500).json({ message: "Server error deleting part" });
    }
};
