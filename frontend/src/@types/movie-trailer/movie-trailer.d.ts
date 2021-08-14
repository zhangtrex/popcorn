/// <reference types="react-scripts" />

declare module 'movie-trailer' {
    export default async function (movieName: string, options: {year: string, multi: boolean = true}): Promise<string[]>;
    export default async function (movieName: string, options: {year: string, multi: boolean = false}): Promise<string>;
    export default async function (movieName: string): Promise<string>;
}

