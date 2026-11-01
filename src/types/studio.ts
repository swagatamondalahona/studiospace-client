
export interface Studio {
    _id: string;
    name: string;
    image: string;
    category: string;
    price: number;
    rating: number;
    location: string;
    description: string;
    securityDeposit: number;
    maxCapacity: number;
    amenities: string[];
    ownerName: string;
    ownerEmail: string;
}
