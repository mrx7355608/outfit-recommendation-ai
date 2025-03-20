// Generate outfit using flux-dev model api
const urlToFile = async (imgUrl: string) => {
  const res = await fetch(imgUrl);
  const blob = await res.blob();
  const file = new File([blob], "outfit.png", { type: blob.type });
  return file;
};

export const generateOutfit = async (
  region: string,
  gender: string,
  ocassion: string,
) => {
  const manWoman = gender === "Male" ? "man" : "woman";
  const prompt = `(${ocassion}), (I am a ${manWoman} living in ${region}), (full body image: 3.6)`;
  const response = await fetch("/api/generate-outfits", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  const result = await response.json();
  if (!result.imageURL) {
    throw new Error(result.error);
  }

  const file = await urlToFile(result.imageURL);
  if (!file) {
    throw new Error("There wan an error in converting the outfit url to image");
  }

  return { outfitUrl: result.imageURL, outfitImage: file };
};

export const diffuse = async (outfit: File, userUploadedImage: File | null) => {
  if (!userUploadedImage) {
    throw new Error("Please upload your image");
  }

  const formData = new FormData();
  formData.append("avatar_image", userUploadedImage);
  formData.append("clothing_image", outfit);

  // FIXME: Remove the rapid api keys!!!
  const url = "https://try-on-diffusion.p.rapidapi.com/try-on-file";
  const options = {
    method: "POST",
    headers: {
      "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY!,
      "x-rapidapi-host": process.env.NEXT_PUBLIC_RAPID_API_HOST!,
    },
    body: formData,
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error("Unable to apply the outfit on your image");
  }

  const imageURL = URL.createObjectURL(await response.blob());
  return imageURL;
};

export const searchGoogleLens = async (imageUrl: string) => {
  const response = await fetch("/api/search-google-lens", {
    method: "POST",
    body: JSON.stringify({ imageUrl }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("There was an error while searching for the outfit");
  }
  const result = await response.json();
  return result.result;
};
