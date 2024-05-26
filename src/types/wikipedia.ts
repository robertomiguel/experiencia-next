
export interface WikiThumbnail {
    mimetype: string;
    width: number;
    height: number;
    duration: number | null;
    url: string;
}

export interface WikiData {
    id: string;
    key: string;
    title: string;
    excerpt: string;
    matched_title: string | null;
    description: string;
    thumbnail: WikiThumbnail;
}

export interface WikiDataList {
    id: string
    title: string
    description: string
    imageUrl: string
}

export interface WikiItemsSelected {
    [key: string]: WikiDataList
}

export interface WikiState {
    itemsSelected: WikiItemsSelected;
}

