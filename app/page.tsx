"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface FeriaItem {
    title: string;
    body: string;
    image: string;
    credits: string;
    isExpanded?: boolean; // Estado para manejar si la tarjeta está expandida o no
    requiresExpand?: boolean; // Estado para saber si es necesario el botón "Ver más"
}

export default function Home() {
    const [feriaData, setFeriaData] = useState<FeriaItem[]>([]);
    const [expandedImage, setExpandedImage] = useState<string | null>(null); // Estado para la imagen expandida

    useEffect(() => {
        fetch("/data.json")
            .then((res) => res.json())
            .then((data) => {
                const updatedData = data.map((item: FeriaItem) => {
                    const MAX_LINES = 3; // Máximo de líneas visibles
                    const truncatedText = item.body.split(" ").slice(0, MAX_LINES * 10).join(" ");
                    return {
                        ...item,
                        isExpanded: false,
                        requiresExpand: item.body.length > truncatedText.length,
                    };
                });
                setFeriaData(updatedData);
            })
            .catch((err) => console.error("Error cargando datos:", err));
    }, []);

    const handleExpand = (index: number) => {
        setFeriaData((prevData) =>
            prevData.map((item, i) =>
                i === index ? { ...item, isExpanded: !item.isExpanded } : item
            )
        );
    };

    const openImage = (imageSrc: string) => {
        setExpandedImage(imageSrc); // Abre la imagen en tamaño completo
    };

    const closeImage = () => {
        setExpandedImage(null); // Cierra la imagen expandida
    };

    return (
        <div className="min-h-screen p-8 pb-20 sm:p-20 font-sans bg-gradient-to-r from-purple-100 via-gray-50 to-blue-100">
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gray-900">Feria de Semana Santa</h1>
                <br></br>
                <p className="text-lg text-gray-600">Descubre todas las actividades y eventos de la festividad en Yahualica, Hidalgo. Por parte del 2° A </p>
            </header>

            <main
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                style={{
                    gridAutoRows: "minmax(200px, auto)", // Altura mínima
                }}
            >
                {feriaData.map((item, index) => (
                    <div
                        key={index}
                        className="bg-gradient-to-b from-white via-gray-50 to-gray-200 rounded-2xl shadow-lg overflow-hidden transition-transform transform hover:scale-105 border border-gray-200 hover:border-gray-400"
                    >
                        <Image
                            src={item.image}
                            alt={item.title}
                            width={400}
                            height={250}
                            className="w-full h-56 object-cover cursor-pointer"
                            onClick={() => openImage(item.image)} // Abrir la imagen al hacer clic
                        />
                        <div className="p-4">
                            <h2 className="text-xl font-bold text-gray-800">{item.title}</h2>
                            <p className="text-gray-600 mt-2">
                                {item.isExpanded
                                    ? item.body
                                    : item.body.split(" ").slice(0, 30).join(" ") + "..." // Truncado dinámico
                                }
                            </p>
                            <div className="flex justify-between items-center mt-3">
                                <p className="text-sm text-gray-400">📌 {item.credits}</p>
                                {item.requiresExpand && ( // Mostrar botón solo si hay más texto para expandir
                                    <button
                                        onClick={() => handleExpand(index)}
                                        className="text-sm text-blue-500 hover:underline"
                                    >
                                        {item.isExpanded ? "Ver menos" : "Ver más"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </main>

            {/* Modal de imagen expandida */}
            {expandedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                    onClick={closeImage} // Cerrar el modal si se hace clic fuera de la imagen
                >
                    <div className="relative w-full h-full flex justify-center items-center">
                        <Image
                            src={expandedImage}
                            alt="Imagen expandida"
                            layout="intrinsic"
                            width={800}
                            height={600}
                            className="max-w-full max-h-full object-contain"
                        />
                        <button
                            className="absolute top-4 right-4 text-white text-2xl"
                            onClick={closeImage}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            <footer className="text-center mt-16 text-gray-500">
                &copy; {new Date().getFullYear()} Telesecundaria 92, Yahualica, Hidalgo
            </footer>
        </div>
    );
}
