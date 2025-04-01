"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface FeriaItem {
    title: string;
    body: string;
    image: string;
    credits: string;
    isExpanded?: boolean;
    requiresExpand?: boolean;
}

export default function Home() {
    const [feriaData, setFeriaData] = useState<FeriaItem[]>([]);
    const [expandedImage, setExpandedImage] = useState<string | null>(null);

    useEffect(() => {
        const storedData = localStorage.getItem("feriaData");

        if (storedData) {
            setFeriaData(JSON.parse(storedData));
        } else {
            fetch("/data.json")
                .then((res) => res.json())
                .then((data) => {
                    const updatedData = data.map((item: FeriaItem) => ({
                        ...item,
                        isExpanded: false,
                        requiresExpand: item.body.length > 150,
                    }));
                    setFeriaData(updatedData);
                })
                .catch((err) => console.error("Error cargando datos:", err));
        }
    }, []);

    useEffect(() => {
        if (feriaData.length > 0) {
            localStorage.setItem("feriaData", JSON.stringify(feriaData));
        }
    }, [feriaData]);

    const toggleExpand = (index: number) => {
        setFeriaData(prevData => prevData.map((item, i) => i === index ? { ...item, isExpanded: !item.isExpanded } : item));
    };

    return (
        <div className="min-h-screen p-10 bg-gradient-to-r from-indigo-300 via-purple-200 to-blue-300 text-gray-900 font-sans">
            <header className="text-center mb-12">
                <h1 className="text-5xl font-extrabold">Feria de Semana Santa</h1>
                <p className="text-lg mt-3">Descubre todas las actividades y eventos en Yahualica, Hidalgo – 2° A</p>
            </header>

            <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {feriaData.map((item, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
                        <Image
                            src={item.image}
                            alt={item.title}
                            width={400}
                            height={250}
                            className="w-full h-56 object-cover cursor-pointer"
                            onClick={() => setExpandedImage(item.image)}
                        />
                        <div className="p-5">
                            <h2 className="text-2xl font-bold">{item.title}</h2>
                            <p className="mt-3 text-gray-700">
                                {item.isExpanded ? item.body : `${item.body.substring(0, 150)}...`}
                            </p>
                            <div className="flex justify-between items-center mt-4">
                                <p className="text-sm text-gray-500">📌 {item.credits}</p>
                                {item.requiresExpand && (
                                    <button
                                        onClick={() => toggleExpand(index)}
                                        className="text-sm text-indigo-600 hover:underline"
                                    >
                                        {item.isExpanded ? "Ver menos" : "Ver más"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </main>

            {expandedImage && (
                <div className="fixed inset-0 flex justify-center items-center z-50 p-4 bg-black bg-opacity-70" onClick={() => setExpandedImage(null)}>
                    <div className="relative max-w-full max-h-full flex justify-center items-center p-6">
                        <Image
                            src={expandedImage}
                            alt="Imagen expandida"
                            layout="intrinsic"
                            width={600}
                            height={900}
                            className="max-w-[80vw] max-h-[80vh] object-contain rounded-lg border-2 border-gray-300"
                        />
                        <button className="absolute top-5 right-5 text-white text-3xl bg-gray-800 bg-opacity-50 rounded-full p-2" onClick={() => setExpandedImage(null)}>✕</button>
                    </div>
                </div>
            )}

            <footer className="text-center mt-16 text-gray-700 text-sm">
                &copy; {new Date().getFullYear()} Telesecundaria 92, Yahualica, Hidalgo
            </footer>
        </div>
    );
}
