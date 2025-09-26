import { defaultStats } from "@/services/default-values";
import { getStats } from "@/services/get-stats";
import { statIconMapper } from "@/services/icon-maper";
import { Mountain } from "lucide-react";

export async function StatsSection({ stats }: { stats: TStat[] }) {
  return (
    <section className="py-16 bg-teal-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-center items-center">
          {stats
            .filter((temp) => temp.isEnabled === true)
            .map((stat, index) => {
              const IconComponent = stat.id
                ? statIconMapper[stat.id]
                : Mountain;

              return (
                <div key={stat.id || index} className="text-center text-white">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
                    <IconComponent className="h-8 w-8 text-teal-600" />
                  </div>
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-xl font-semibold mb-1">{stat.title}</div>
                  {stat.description && (
                    <div className="text-teal-100 text-sm">
                      {stat.description}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}
