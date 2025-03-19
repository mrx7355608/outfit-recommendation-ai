interface IGoogleLensResponse {
  source: string;
  price?: { value: string; extracted_value: number; currency: string };
  link: string;
  in_stock?: boolean;
}
export interface IMessage {
  id: string;
  role: string;
  content: string;
  image?: string;
  outfitGenerated: boolean;
  diffusedImageUrl: string | null;
  googleLensResponse: IGoogleLensResponse[] | null;
}
