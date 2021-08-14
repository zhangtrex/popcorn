/// <reference types="react-scripts" />

declare module 'react-infinite-scroller' {
    export default function (props: {
        pageStart: number,
        loadMore: (page: int) => void,
        hasMore: boolean,
        loader: JSX.Element,
        children: React.ReactNode
    }): JSX.Element;
}

