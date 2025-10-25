import fs from "fs";
import path from "path";

const PostImageService = {
    createPostImageDirectory(postId) {
        const uploadDir = `public/uploads/posts/${postId}`;
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        return uploadDir;
    },

    getPostImages(postId) {
        const uploadDir = `public/uploads/posts/${postId}`;
        if (!fs.existsSync(uploadDir)) {
            return [];
        }

        try {
            const files = fs.readdirSync(uploadDir);
            return files
                .filter(file => {
                    const filePath = path.join(uploadDir, file);
                    return fs.statSync(filePath).isFile() && this.isImageFile(file);
                })
                .map(file => ({
                    filename: file,
                    path: `/uploads/posts/${postId}/${file}`,
                    fullPath: path.join(uploadDir, file)
                }));
        } catch (error) {
            console.error(`Error reading post images for post ${postId}:`, error);
            return [];
        }
    },

    clearPostImages(postId) {
        const uploadDir = `public/uploads/posts/${postId}`;
        if (!fs.existsSync(uploadDir)) {
            return { success: true, message: "No images directory found" };
        }

        try {
            const files = fs.readdirSync(uploadDir);
            let deletedCount = 0;

            files.forEach(file => {
                const filePath = path.join(uploadDir, file);
                if (fs.statSync(filePath).isFile()) {
                    fs.unlinkSync(filePath);
                    deletedCount++;
                }
            });

            return {
                success: true,
                message: `Deleted ${deletedCount} images`,
                deletedCount
            };
        } catch (error) {
            console.error(`Error clearing post images for post ${postId}:`, error);
            throw new Error(`Failed to clear images: ${error.message}`);
        }
    },

    deletePostImageDirectory(postId) {
        const uploadDir = `public/uploads/posts/${postId}`;
        if (fs.existsSync(uploadDir)) {
            try {
                this.clearPostImages(postId);
                fs.rmdirSync(uploadDir);
                return { success: true, message: "Post image directory deleted" };
            } catch (error) {
                console.error(`Error deleting post image directory for post ${postId}:`, error);
                throw new Error(`Failed to delete image directory: ${error.message}`);
            }
        }
        return { success: true, message: "Directory did not exist" };
    },

    isImageFile(filename) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
        const ext = path.extname(filename).toLowerCase();
        return imageExtensions.includes(ext);
    },

    moveUploadedImages(postId, uploadedFiles) {
        if (!uploadedFiles || uploadedFiles.length === 0) {
            return [];
        }

        const targetDir = this.createPostImageDirectory(postId);
        const movedImages = [];

        uploadedFiles.forEach((file, index) => {
            try {
                const ext = path.extname(file.originalname);
                const newFilename = `image-${index + 1}${ext}`;
                const targetPath = path.join(targetDir, newFilename);

                if (fs.existsSync(file.path)) {
                    fs.renameSync(file.path, targetPath);
                    movedImages.push({
                        filename: newFilename,
                        originalname: file.originalname,
                        path: `/uploads/posts/${postId}/${newFilename}`,
                        size: file.size
                    });
                }
            } catch (error) {
                console.error(`Error moving image ${file.originalname}:`, error);
                if (fs.existsSync(file.path)) {
                    try {
                        fs.unlinkSync(file.path);
                    } catch (cleanupError) {
                        console.error(`Error cleaning up failed upload:`, cleanupError);
                    }
                }
            }
        });

        return movedImages;
    },

    cleanupTempFiles(uploadedFiles) {
        if (!uploadedFiles || uploadedFiles.length === 0) {
            return;
        }

        uploadedFiles.forEach(file => {
            try {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            } catch (error) {
                console.error(`Error cleaning up temp file ${file.path}:`, error);
            }
        });
    },

    deleteImageById(postId, imageId) {
        const uploadDir = `public/uploads/posts/${postId}`;
        if (!fs.existsSync(uploadDir)) {
            throw new Error("Post image directory not found");
        }

        const imagePath = path.join(uploadDir, imageId);

        if (!fs.existsSync(imagePath)) {
            throw new Error("Image not found");
        }

        if (!fs.statSync(imagePath).isFile()) {
            throw new Error("Not a valid image file");
        }

        try {
            fs.unlinkSync(imagePath);
            return { success: true, message: "Image deleted successfully" };
        } catch (error) {
            console.error(`Error deleting image ${imageId} for post ${postId}:`, error);
            throw new Error(`Failed to delete image: ${error.message}`);
        }
    },

    replacePostImages(postId, uploadedFiles, keepImageFilenames = []) {
        const targetDir = this.createPostImageDirectory(postId);

        const uploadedFilePaths = new Set();
        if (uploadedFiles && uploadedFiles.length > 0) {
            uploadedFiles.forEach(file => {
                uploadedFilePaths.add(path.basename(file.path));
            });
        }

        const existingImages = this.getPostImages(postId);

        existingImages.forEach(img => {
            if (!keepImageFilenames.includes(img.filename) && !uploadedFilePaths.has(img.filename)) {
                try {
                    const imagePath = path.join(targetDir, img.filename);
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }
                } catch (error) {
                    console.error(`Error deleting image ${img.filename}:`, error);
                }
            }
        });

        if (!uploadedFiles || uploadedFiles.length === 0) {
            return this.getPostImages(postId);
        }

        let maxIndex = 0;
        const keptImages = this.getPostImages(postId);
        keptImages.forEach(img => {
            const match = img.filename.match(/^image-(\d+)\./);
            if (match) {
                const num = parseInt(match[1], 10);
                if (num > maxIndex) {
                    maxIndex = num;
                }
            }
        });

        const renamedImages = [];
        uploadedFiles.forEach((file, index) => {
            try {
                const ext = path.extname(file.originalname);
                const newFilename = `image-${maxIndex + index + 1}${ext}`;
                const targetPath = path.join(targetDir, newFilename);

                if (fs.existsSync(file.path)) {
                    fs.renameSync(file.path, targetPath);
                    renamedImages.push({
                        filename: newFilename,
                        originalname: file.originalname,
                        path: `/uploads/posts/${postId}/${newFilename}`,
                        size: file.size
                    });
                }
            } catch (error) {
                console.error(`Error renaming image ${file.originalname}:`, error);
                if (fs.existsSync(file.path)) {
                    try {
                        fs.unlinkSync(file.path);
                    } catch (cleanupError) {
                        console.error(`Error cleaning up failed upload:`, cleanupError);
                    }
                }
            }
        });

        return this.getPostImages(postId);
    }
};

export default PostImageService;