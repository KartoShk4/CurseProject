export type TitlePart = {
  text: string;
  isHighlighted?: boolean;
};

export type SliderType = {
  image: string;
  pretitle: string;
  titleParts: TitlePart[];
  text: string;
  serviceTitle: string;
};
