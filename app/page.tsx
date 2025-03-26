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

    useEffect(() => {
        fetch("/data.json")
            .then((res) => res.json())
            .then((data) => {
                // Evaluamos si cada tarjeta necesita el botón "Ver más"
                const updatedData = data.map((item: FeriaItem) => {
                    const MAX_LINES = 3; // Máximo de líneas visibles
                    const truncatedText = item.body.split(" ").slice(0, MAX_LINES * 10).join(" "); // Aproximación
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

    return (
        <div className="min-h-screen p-8 pb-20 sm:p-20 font-sans bg-gradient-to-r from-purple-100 via-gray-50 to-blue-100">
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gray-900">Feria de Semana Santa</h1>
                <p className="text-lg text-gray-600">
                    Descubre todas las actividades y eventos de la festividad.
                </p>
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
                            className="w-full h-56 object-cover"
                        />
                        <div className="p-4">
                            <h2 className="text-xl font-bold text-gray-800">{item.title}</h2>
                            {/* Si la tarjeta está expandida, mostramos todo el texto; si no, lo truncamos */}
                            <p className={`text-gray-600 mt-2 ${item.isExpanded ? "" : "line-clamp-3"}`}>
                                {item.body}
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

            <footer className="text-center mt-16 text-gray-500">
                &copy; {new Date().getFullYear()} Feria de Semana Santa
            </footer>
        </div>
    );
}
