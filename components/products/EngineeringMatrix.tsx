"use client";

import { useState } from "react";

export default function EngineeringMatrix() {
  const [activeTab, setActiveTab] = useState<"grades" | "pulleys" | "chevron">("grades");

  return (
    <section className="w-full bg-surface-container-low py-space-xl">
      <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin">
        <div className="mb-space-lg">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
            Engineering Matrix
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            Technical Specification &amp; Sizing Reference
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Mechanical values and dimensional constraints compliant with IS 1891 (Part 1) and DIN 22102 conveyor engineering standards.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 border-b-2 border-surface-container-highest pb-2 mb-space-md overflow-x-auto">
          <button
            type="button"
            className={`px-space-md py-2 font-label-md text-label-md rounded-lg transition-all cursor-pointer ${
              activeTab === "grades"
                ? "bg-primary text-on-primary font-semibold shadow-sm"
                : "bg-surface-container-lowest text-on-surface-variant hover:text-on-surface"
            }`}
            onClick={() => setActiveTab("grades")}
          >
            Rubber Cover Grades (IS 1891)
          </button>
          <button
            type="button"
            className={`px-space-md py-2 font-label-md text-label-md rounded-lg transition-all cursor-pointer ${
              activeTab === "pulleys"
                ? "bg-primary text-on-primary font-semibold shadow-sm"
                : "bg-surface-container-lowest text-on-surface-variant hover:text-on-surface"
            }`}
            onClick={() => setActiveTab("pulleys")}
          >
            Carcass Rating &amp; Minimum Pulley Chart
          </button>
          <button
            type="button"
            className={`px-space-md py-2 font-label-md text-label-md rounded-lg transition-all cursor-pointer ${
              activeTab === "chevron"
                ? "bg-primary text-on-primary font-semibold shadow-sm"
                : "bg-surface-container-lowest text-on-surface-variant hover:text-on-surface"
            }`}
            onClick={() => setActiveTab("chevron")}
          >
            Chevron Cleat Geometry Specs
          </button>
        </div>

        {/* Tab 1: Cover Grades Table */}
        {activeTab === "grades" && (
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/20">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body-sm text-body-sm">
                <thead className="bg-surface-container font-label-sm text-label-sm uppercase text-on-surface-variant">
                  <tr>
                    <th className="py-3 px-space-md">Grade Classification</th>
                    <th className="py-3 px-space-md">Standard Equivalent</th>
                    <th className="py-3 px-space-md">Min. Tensile Strength</th>
                    <th className="py-3 px-space-md">Min. Elongation at Break</th>
                    <th className="py-3 px-space-md">Max. Abrasion Loss (mm³)</th>
                    <th className="py-3 px-space-md">Target Handling Duty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3.5 px-space-md font-semibold text-primary">Grade M24</td>
                    <td className="py-3.5 px-space-md font-code-spec">DIN 22102 Grade W</td>
                    <td className="py-3.5 px-space-md font-code-spec">24.0 MPa (240 kg/cm²)</td>
                    <td className="py-3.5 px-space-md font-code-spec">450%</td>
                    <td className="py-3.5 px-space-md font-code-spec">120 mm³</td>
                    <td className="py-3.5 px-space-md">Crushed stone, iron ore, sharp granite aggregate</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3.5 px-space-md font-semibold text-on-surface">Grade N17</td>
                    <td className="py-3.5 px-space-md font-code-spec">DIN 22102 Grade X</td>
                    <td className="py-3.5 px-space-md font-code-spec">17.0 MPa (170 kg/cm²)</td>
                    <td className="py-3.5 px-space-md font-code-spec">400%</td>
                    <td className="py-3.5 px-space-md font-code-spec">150 mm³</td>
                    <td className="py-3.5 px-space-md">Sand, gravel, bauxite, grain, general warehouse packaging</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3.5 px-space-md font-semibold text-tertiary">Grade HR (Heat Resistant)</td>
                    <td className="py-3.5 px-space-md font-code-spec">IS 1891 Part 2</td>
                    <td className="py-3.5 px-space-md font-code-spec">15.0 MPa</td>
                    <td className="py-3.5 px-space-md font-code-spec">350%</td>
                    <td className="py-3.5 px-space-md font-code-spec">180 mm³</td>
                    <td className="py-3.5 px-space-md">Foundry sand, hot pellets, clinker up to 120°C</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3.5 px-space-md font-semibold text-error">Grade SHR (Super Heat)</td>
                    <td className="py-3.5 px-space-md font-code-spec">EPDM Compound</td>
                    <td className="py-3.5 px-space-md font-code-spec">14.0 MPa</td>
                    <td className="py-3.5 px-space-md font-code-spec">350%</td>
                    <td className="py-3.5 px-space-md font-code-spec">200 mm³</td>
                    <td className="py-3.5 px-space-md">Red-hot clinker, sintering plants up to 180°C peak</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Pulley Diameter Recommendations */}
        {activeTab === "pulleys" && (
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/20">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body-sm text-body-sm">
                <thead className="bg-surface-container font-label-sm text-label-sm uppercase text-on-surface-variant">
                  <tr>
                    <th className="py-3 px-space-md">Carcass Spec / Total Tension</th>
                    <th className="py-3 px-space-md">No. of Plies</th>
                    <th className="py-3 px-space-md">Min Drive Pulley (60-100% Tension)</th>
                    <th className="py-3 px-space-md">Min Drive Pulley (&lt;60% Tension)</th>
                    <th className="py-3 px-space-md">Tail / Take-Up Pulley</th>
                    <th className="py-3 px-space-md">Snub / Bend Pulley</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container font-code-spec text-code-spec">
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3.5 px-space-md font-semibold text-primary">EP 250 / 2 Ply</td>
                    <td className="py-3.5 px-space-md">2</td>
                    <td className="py-3.5 px-space-md">250 mm</td>
                    <td className="py-3.5 px-space-md">200 mm</td>
                    <td className="py-3.5 px-space-md">200 mm</td>
                    <td className="py-3.5 px-space-md">160 mm</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3.5 px-space-md font-semibold text-primary">EP 400 / 3 Ply</td>
                    <td className="py-3.5 px-space-md">3</td>
                    <td className="py-3.5 px-space-md">315 mm</td>
                    <td className="py-3.5 px-space-md">250 mm</td>
                    <td className="py-3.5 px-space-md">250 mm</td>
                    <td className="py-3.5 px-space-md">200 mm</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3.5 px-space-md font-semibold text-primary">EP 630 / 4 Ply</td>
                    <td className="py-3.5 px-space-md">4</td>
                    <td className="py-3.5 px-space-md">500 mm</td>
                    <td className="py-3.5 px-space-md">400 mm</td>
                    <td className="py-3.5 px-space-md">400 mm</td>
                    <td className="py-3.5 px-space-md">315 mm</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3.5 px-space-md font-semibold text-primary">EP 800 / 4 Ply</td>
                    <td className="py-3.5 px-space-md">4</td>
                    <td className="py-3.5 px-space-md">630 mm</td>
                    <td className="py-3.5 px-space-md">500 mm</td>
                    <td className="py-3.5 px-space-md">500 mm</td>
                    <td className="py-3.5 px-space-md">400 mm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Chevron Profile Geometry */}
        {activeTab === "chevron" && (
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md border border-outline-variant/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
              <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col justify-between border border-outline-variant/10">
                <div>
                  <div className="inline-block px-2 py-0.5 rounded bg-primary text-on-primary font-code-spec text-xs font-bold mb-2">
                    Profile C15 (Open V)
                  </div>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    15mm Cleat Height
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                    Ideal for granular sand, loose aggregates up to 25mm diameter, and small grain elevating at incline slopes between 18° and 30°.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-surface-container font-code-spec text-code-spec text-on-surface-variant flex justify-between">
                  <span>Cleat Pitch: 250mm</span>
                  <span>Min Pulley: 250mm</span>
                </div>
              </div>

              <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col justify-between border border-outline-variant/10">
                <div>
                  <div className="inline-block px-2 py-0.5 rounded bg-secondary text-on-secondary font-code-spec text-xs font-bold mb-2">
                    Profile C25 (Closed V)
                  </div>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    25mm Cleat Height
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                    High-capacity trough transport for crushed blue metal, road gravel, and wet bagged cargo on inclines up to 35°.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-surface-container font-code-spec text-code-spec text-on-surface-variant flex justify-between">
                  <span>Cleat Pitch: 330mm</span>
                  <span>Min Pulley: 315mm</span>
                </div>
              </div>

              <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col justify-between border border-outline-variant/10">
                <div>
                  <div className="inline-block px-2 py-0.5 rounded bg-tertiary text-on-tertiary font-code-spec text-xs font-bold mb-2">
                    Profile C32 (Heavy Duty)
                  </div>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    32mm Cleat Height
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                    Extreme angle applications up to 40° slope for uncrushed quarry rock, potato harvesting, and wet bulk slurries.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-surface-container font-code-spec text-code-spec text-on-surface-variant flex justify-between">
                  <span>Cleat Pitch: 400mm</span>
                  <span>Min Pulley: 400mm</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
