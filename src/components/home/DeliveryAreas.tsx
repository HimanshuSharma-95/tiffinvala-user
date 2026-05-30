"use client";

export default function DeliveryAreas() {
    const seattleAreas = [
        "seattle",
        "bellevue",
        "redmond",
        "kirkland",
        "bothell",
        "lynnwood",
        "everett",
        "mill creek",
        "woodinville",
        "sammamish",
        "issaquah",
        "newcastle",
        "renton",
        "kent",
        "kenmore",
        "lake forest park",
        "maple valley",
        "snohomish",
        "auburn"
    ];

    const bayArea = [
        "san mateo",
        "foster city",
        "burlingame",
        "san carlos",
        "redwood city",
        "belmont",
        "menlo park",
        "palo alto",
        "mountain view",
        "los altos",
        "sunnyvale",
        "cupertino",
        "santa clara",
        "san jose",
        "saratoga",
        "campbell",
        "los gatos",
        "milpitas",
        "livermore",
        "dublin",
        "ruby hill",
        "san ramon",
        "danville",
        "pleasanton"
    ];

    return (
        <section className="w-full px-4 py-12">
            <div className="max-w-7xl mx-auto">

                {/* Heading */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#1E2A3A]">
                        Delivery Areas
                    </h2>

                    <p className="text-gray-600 mt-3 text-sm md:text-base">
                        Fresh homemade tiffins delivered across Seattle & Bay Area.
                    </p>
                </div>

                {/* Seattle */}
                <div className="mb-8">
                    <h3 className="text-2xl font-bold text-[#F97316] mb-4">
                        Seattle
                    </h3>

                    <div className="border border-orange-100 rounded-2xl p-5 bg-white">
                        <div className="flex flex-wrap gap-3 text-sm md:text-base text-gray-700">
                            {seattleAreas.map((area) => (
                                <div
                                    key={area}
                                    className="border border-gray-200 px-4 py-2 rounded-lg"
                                >
                                    {area}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bay Area */}
                <div>
                    <h3 className="text-2xl font-bold text-[#F97316] mb-4">
                        Bay Area
                    </h3>

                    <div className="border border-orange-100 rounded-2xl p-5 bg-white">
                        <div className="flex flex-wrap gap-3 text-sm md:text-base text-gray-700">
                            {bayArea.map((area) => (
                                <div
                                    key={area}
                                    className="border border-gray-200 px-4 py-2 rounded-lg"
                                >
                                    {area}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}