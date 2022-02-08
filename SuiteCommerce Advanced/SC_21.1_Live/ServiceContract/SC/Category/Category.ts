export interface CategoryTree {
    data: (Category | FullCategory)[];
}

export interface Category {
    displayinsite: boolean;
    fullurl: string;
    internalid: string;
    level: string;
    name: string;
    parentIdPath: string;
    sequencenumber: string;
    description?: string;
    urlfragment?: string;
    thumbnailurl?: string;
    categories: Category[];
}

export interface FullCategory {
    parenturl: string;
    urlfragment: string;
    siblings: CategoryTree[];
    internalid: string;
    name: string;
    description: string;
    pagetitle: string;
    pageheading: string;
    pagebannerurl: string;
    addtohead: string;
    metakeywords: string;
    metadescription: string;
    displayinsite: boolean;
    idpath: string;
    fullurl: string;
    isprimaryurl: boolean;
    canonical: string;
    categories: Category[];
    breadcrumb: Breadcrumb[];
}

interface Breadcrumb {
    internalid: string;
    name: string;
    displayinsite: boolean;
    fullurl: string;
}
