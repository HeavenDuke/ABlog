/**
 * Created by heavenduke on 16-8-13.
 */

let Photo = {};

Photo.Schema = {
    title: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    introduction: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    updated_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    path: {
        type: String,
        required: true
    }
};

Photo.get_thumb_image = function (image_path) {
    let dotIndex = image_path.lastIndexOf(".");
    return image_path.substring(0, dotIndex) + "_thumb." + image_path.substring(dotIndex + 1);
};

Photo.get_image_container = function () {
    let result = "<div class='grid-masonry-item' photoinfo='" + JSON.stringify(this) + "'>";
    result += "<img class='margin photo-border' src='" + Photo.get_thumb_image("/" + this.path) + "'/>";
    result += "<a data-toggle='modal' data-target='#photo_detail_modal'>";
    result += "<div class='overlay margin text-center photo-border'>";
    result += "<div class='photo-title text-center'>";
    result += this.title;
    result += "</div>";
    result += "<div class='photo-info'>";
    result += this.location + "　" + this.created_at.format("yyyy年MM月dd日");
    result += "</div>";
    result += "</div>";
    result += "</a>";
    result += "</div>";
    return result;
};

Photo.collection = {
    collection: 'Photos'
};

module.exports = Photo;