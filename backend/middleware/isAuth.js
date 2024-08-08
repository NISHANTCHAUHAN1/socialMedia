import jwt from "jsonwebtoken";

const isAuth = async(req,res,next) => {
    try {
        const token = req.cookies.token;
        if(!token) return res.status(403).json({message: "Please Login"});

        const decodedData = await jwt.verify(token, process.env.SEC_KEY);
        if(!decodedData) return res.status(403).json({message: "token expired"});

        req.id = decodedData.userId;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Please Login"});
    }
}

export default isAuth;