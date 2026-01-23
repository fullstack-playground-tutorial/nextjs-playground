"use server";

import { Film } from "./film";

export async function createFilm(film: Film) {
    console.log("Creating film:", film);
    return { successMsg: "Film created successfully! (Mock)" };
}

export async function updateFilm(id: string, film: Partial<Film>) {
    console.log("Updating film:", id, film);
    return { successMsg: "Film updated successfully! (Mock)" };
}