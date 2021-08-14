/// <reference types="react-scripts" />

declare module 'search-bar-react' {
    export default function (props: {
        mobile?: boolean,
        value: string,
        placeholder: string,
        clearBtnText?: string,
        width: string,
        size: string,
        loading?: boolean,
        autoFocus: boolean,
        onChange: (text: string) => void,
        onFocus: () => void,
        onClear: () => void

    }): JSX.Element;
}

