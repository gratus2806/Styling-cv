// Sidebar route metadata
export interface RouteInfo {
    ids:string;
    path: string;
    // title: string;
    name:string;
    icon: string;
    type:string;
    // class: string;
    // badge: string;
    // badgeClass: string;
    // isExternalLink: boolean;
    // isuserMenuLink: boolean;
    opened : boolean;
    subsections : [];
    // submenu : RouteInfo[];
}
