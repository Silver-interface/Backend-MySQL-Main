import express from "express";

const router = express.Router();

router.post("/sendEmail",(req, res) => {
        console.log(req.body);
    })

export default router;