// Generate outfit using flux-dev model api
const urlToFile = async (imgUrl: string) => {
  const res = await fetch(imgUrl);
  const blob = await res.blob();
  const file = new File([blob], "outfit.png", { type: blob.type });
  return file;
};

export const generateOutfit = async (gender: string, ocassion: string) => {
  const prompt = `(${gender}:1.0)(outfit inspired by traditional fashion from Karachi, Pakistan:1.2), (designed for ${ocassion}:1.3), (high-quality textures:1.2), (natural pose:1.0), (realistic lighting:1.0), (full body view:1.1)`;
  const response = await fetch("/api/generate-outfits", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  const result = await response.json();
  if (!result.imageURL) {
    throw new Error("There was an error while generating outfit");
  }

  const file = await urlToFile(result.imageURL);
  if (!file) {
    throw new Error("There wan an error in converting the outfit url to image");
  }

  return file;
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
