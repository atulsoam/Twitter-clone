import jwt from "jsonwebtoken";


export const generateToken= (UserID, res)=>{

    const token = jwt.sign({UserID}, process.env.JWTTOKEN,{
        expiresIn:"15d"

    })

    res.cookie("jwt", token, {
        maxAge : 15*24*60*60*1000,
        httpOnly: true

    })
}