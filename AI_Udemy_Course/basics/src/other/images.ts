import OpenAI from "openai";
//import FileSystem from "fs"; ---- this imports all the functions of the fs module, but we only need writeFileSync, so we can import it directly
import { writeFileSync, createReadStream } from "fs";

const openai = new OpenAI();

async function generateLowestQualityImage() {
    const response = await openai.images.generate({
        prompt: "a photo of a koala on a tree beautiful tree with a sunset in the background",
        model: "gpt-image-1",
        size: "1024x1024",
        quality:"low",
        n: 1
    });
    
    const imageAsBase64 = response.data![0].b64_json;
    
    if(imageAsBase64) {
        writeFileSync("koala.png", Buffer.from(imageAsBase64, "base64"));
        console.log("image saved as koala.png \n");
    }

    console.log(response.usage);
}

async function generateMidQualityImage() {
    const response = await openai.images.generate({
        prompt: "a photo of a koala on a tree beautiful tree with a sunset in the background",
        model: "gpt-image-1",
        size: "1536x1024",
        quality: "high",
        n: 1
    });
    
    const imageAsBase64 = response.data![0].b64_json;
    
    if(imageAsBase64) {
        writeFileSync("koala_mid_quality.png", Buffer.from(imageAsBase64, "base64"));
        console.log("image saved as koala_mid_quality.png \n");
    }

    console.log(response.usage);
}

async function generateTopQualityImage() {
    const response = await openai.images.generate({
        // prompt: "a photo of a funny koala on a tree",
        model: "gpt-image-2",
        prompt: "a photo of a koala on a tree beautiful tree with a sunset in the background",
        size: "3840x2160" as any,
        quality: "high",
        n: 1
    });

    const imageAsBase64 = response.data![0].b64_json;

    if(imageAsBase64) {
        writeFileSync("koala_high_quality.png", Buffer.from(imageAsBase64, "base64"));
        console.log("image saved as koala_high_quality.png \n");
    }

    console.log(response.usage);
}

async function editImage() {
    const response = await openai.images.edit({
        image: createReadStream("koala_mid_quality.png"),
        mask: createReadStream("koala_mid_quality_mask.png"),
        prompt: "add baby koalas to the left of the koala, and ufo to the right of the koala",
        model: "gpt-image-1",
        quality: "high",
        n: 1
    });

    const imageAsBase64 = response.data![0].b64_json;

    if(imageAsBase64) {
        writeFileSync("koala_mid_quality_edited.png", Buffer.from(imageAsBase64, "base64"));
        console.log("image saved as koala_mid_quality_edited.png \n");
    }
    
    console.log(response.usage);

}

// generateLowestQualityImage();
// generateMidQualityImage();
// generateTopQualityImage();
editImage();