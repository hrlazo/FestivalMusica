// src: permite que identifica un archivo
// dest: guardar el archivo
const{ src, dest, watch } =require("gulp"); // Traer funciones de gulp contenidas en .bin de node_modules
const sass = require("gulp-sass")(require("sass"));
const plumber = require("gulp-plumber");

function css(done){
    src('src/scss/**/*.scss') // Indentificar el archivo SASS / Con **/* identifica todo los SASS
        .pipe(plumber()) // Evita el erro al tener un error en SCSS
        .pipe(sass()) // Compilarlo 
        .pipe(dest("build/css")); // Almacenarlo en el disco duro
    done();// Callback de avio a gulp de cuando llegamos al final
}

function dev(done){
    watch('src/scss/**/*.scss',css);
    done();
}
exports.css=css; //Ejecutamos la funcion.
exports.dev=dev; // funcion que establece un watch a todas nuestras funciones