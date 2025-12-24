import { Shield, Map, Compass, Gem } from "lucide-react";
import { ImageLoader } from "../ui/image-loader";
import { SlideUp, StaggerContainer, StaggerItem, FadeIn } from "../ui/motion-wrapper";

export function WhyChooseUs() {
  const features = [
    {
      id: "01",
      icon: Map,
      title: "Explore the Nature",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      id: "02",
      icon: Compass,
      title: "Tour Guide",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      id: "03",
      icon: Shield,
      title: "Hidden Gems",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      id: "04",
      icon: Gem,
      title: "Simple Booking",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Heading & Grid */}
          <div>
            <SlideUp className="mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Adventure Is Just<br />One Click Away
              </h2>
              <p className="text-gray-600 text-lg max-w-lg">
                Curated luxury escapes designed to recharge your soul. From serene beaches to five-star retreats, we'll get you there in style.
              </p>
            </SlideUp>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature) => (
                <StaggerItem
                  key={feature.id}
                  className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-12 h-12 ${feature.bgColor} rounded-full flex items-center justify-center`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <span className="text-gray-400 font-semibold">{feature.id}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {feature.description}
                  </p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          <FadeIn className="relative h-[600px] rounded-[40px] overflow-hidden shadow-2xl">
            <ImageLoader
              src="/images/posters/poster-34.jpg"
              fallbackSrc="/images/posters/poster-adventure.jpg"
              alt="Tropical Paradise"
              height="h-full"
              className="w-full h-full object-cover"
            />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
