export interface EnterpriseData {
  name: string;
  sector: string;
  description: string | null;
  logo: string | null;
  photos: string[];
  socials: {
    type: string;
    value: string;
    label: string;
  }[];
  reviews: {
    rating: number;
    count: number;
    distribution: { [key: string]: number };
  };
  slug: string;
}
