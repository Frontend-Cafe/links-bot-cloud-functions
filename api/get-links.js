import content from "./content";

module.exports = (req, res) => {
    const key = req.query.key;
    const chat = key ? content[key] : "";

    res.json({
        key: key,
        body: chat,
    });
};