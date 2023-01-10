export interface Animal {
  id?: string;
  type?: string;
  name: string;
  breed?: string;
  tagNumber?: number;
  registrationnumber?: number;
  birthDate?: string;
  purchaseDate?: string;
  cost?: number;
  neutered?: boolean;
  neuteredDate?: string;
  deathDate?: string;
  cull?: boolean;
  sold?: boolean;
  soldTo?: string;
  salePrice?: number;
  saleDate?: string;
  auctionSale?: boolean;
  auctionName?: string;
  auctionWeight?: number;
  sire?: string;
  dam?: string;
  damSire?: string;
  breeder?: string;
  notes?: string;
  birthWeight?: number;
  herd?: Herd;
  herdId?: string;
  ownerId?: string;
  photoUrl?: string;
}

export interface Herd {
  id?: string;
  name: string;
  animals?: Animal[];
  ownerId?: string;
}
