// src: permite que identifica un archivo
// dest: guardar el archivo
// Trae funciones de gulp contenidas en .bin de node_modules
const{ src, dest, watch, parallel} = require("gulp");

// Dependencias para CSS y SASS
const sass = require("gulp-sass")(require("sass"));
const plumber = require("gulp-plumber");

// CSS una vez se termine el proyecto
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

// JS
const terser = require('gulp-terser-js');

// Imagenes
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache'); // Necesaria para usar el imagemin
const avif = require('gulp-avif');

// Watcher y compilado de SASS 
function css(done){
    src('src/scss/**/*.scss') // Indentificar el archivo SASS / Con **/* identifica todo los SASS
        .pipe(sourcemaps.init())
        .pipe(plumber()) // Evita el error al tener un error en SCSS
        .pipe(sass()) // Compilarlo 
        .pipe( postcss([autoprefixer(), cssnano()])) // Agregar al final del desarrollo
        .pipe(sourcemaps.write("."))
        .pipe(dest("build/css")); // Almacenarlo en el disco duro
    done();// Callback de avio a gulp de cuando llegamos al final
}

// Webp
function versionWebp(done){
    const opciones = {
        quality: 50
    };
    src('src/img/**/*.{png,jpg}')
        .pipe(webp(opciones))
        .pipe(dest('build/img'))
    done();
}

function versionAvif(done){
    const opciones = {
        quality: 50
    };
    src('src/img/**/*.{png,jpg}')
        .pipe(avif(opciones))
        .pipe(dest('build/img'))
    done();
}

// Mejor performance para JPG y PNG
function imagenes(done){
    const opciones = {
        optimizationLevel:3
    }
    src('src/img/**/*.{png,jpg}')
        .pipe(cache(imagemin(opciones)))
        .pipe(dest('build/img'))
    done();
}

// JS
function javascript(done){
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write("."))
        .pipe(dest('build/js'))
    done();
}


function dev(done){
    watch('src/scss/**/*.scss',css);
    watch('src/js/**/*.js',javascript);
    done();
}
exports.css = css; //Ejecutamos la funcion.
exports.versionWebp = versionWebp; // Formato Webp
exports.versionAvif = versionAvif; // Formato Avif
exports.imagenes = imagenes; 
exports.javascript = javascript;
// Funcion que establece un watch a todas nuestras funciones
exports.dev= parallel( imagenes, versionWebp, versionAvif, javascript, dev); 
