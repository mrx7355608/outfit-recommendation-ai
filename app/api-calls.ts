// Generate outfit using flux-dev model api
const urlToFile = async (imgUrl: string) => {
  const res = await fetch(imgUrl);
  const blob = await res.blob();
  const file = new File([blob], "outfit.png", { type: blob.type });
  return file;
};

export const generateOutfitPromptFromGemini = async (
  region: string,
  gender: string,
  ocassion: string,
) => {
  const loc = region.split(",");

  const payload = {
    region: loc[0],
    city: loc[1],
    country: loc[2],
    age: 20,
    gender,
    ocassion,
  };

  const response = await fetch("/api/get-outfit-prompt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  return result.outfitPrompt;
};

export const generateOutfit = async (prompt: string) => {
  const response = await fetch("/api/generate-outfits", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  const result = await response.json();
  return result;
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
