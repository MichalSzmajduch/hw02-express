import upload from "../config/multer.js";
const validateUpload = upload.single("avatar");
export default validateUpload;
