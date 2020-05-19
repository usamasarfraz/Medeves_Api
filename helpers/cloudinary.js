const fs = require('fs');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'medeves',
    api_key: '574485322794261',
    api_secret: 'yU2nYXfVJ941a1JbhC6tFaA4Xfc'
})
exports.cloudinary = async (files) => {
    let urlList = [];
    try{
        for (let index = 0; index < files.length; index++) {
            let data = await cloudinary.uploader.upload(files[index].path);
            urlList.push({path: data.url});
            fs.unlinkSync(files[index].path);
        }
    }
    catch(err){
        console.log(err.message);
    }
    return urlList;
}