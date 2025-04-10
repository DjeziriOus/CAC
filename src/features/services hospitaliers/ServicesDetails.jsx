"use client";

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ImageModal } from "@/components/ImageModal";
import { ImageCarousel } from "@/components/ImageCarousel";
import { API_URL } from "@/utils/constants";
import { useService } from "@/features/dashboard/Services/useService";
import { Spinner } from "@/components/ui/Spinner";

// Sample service data (same as before)
// const serviceData = {
//   service: {
//     id: 4,
//     title: "t1",
//     description: "d1",
//     endroit: "sba",
//     date: "2020-10-01T00:00:00.000Z",
//     type: "national",
//     coverUrl: "/uploads/1740848022179.png",
//     medecin: {
//       id: 2,
//       nom: "Allag",
//       prenom: "Aymen",
//       email: "Aymen@esi-sba.dz",
//     },
//     createdAt: "2025-03-01T16:53:42.000Z",
//     updatedAt: "2025-03-01T17:35:31.000Z",
//     sections: [
//       {
//         title: "title",
//         id: 8,
//         paragraph: "title title title title ",
//         images: [
//           { imgUrl: "/uploads/1740850495070.png" },
//           { imgUrl: "/uploads/1740850528830.png" },
//         ],
//       },
//       {
//         title: "title",
//         id: 9,
//         paragraph:
//           "titletitletitletitle titletitletitletitle titletitletitletitle titletitletitletitle ",
//         images: [{ imgUrl: "/uploads/1740850500506.png" }],
//       },
//       {
//         title: "title",
//         id: 10,
//         paragraph: "title title title ",
//         images: [{ imgUrl: "/uploads/1740850508937.png" }],
//       },
//     ],
//   },
// };

export default function ServiceDetails() {
  // const { id } = useParams();
  // const {service, }
  const { service, isPending, error } = useService();
  // const { service } = serviceData; // In a real app, you would fetch based on the ID
  // const formattedDate =

  const [selectedImage, setSelectedImage] = useState(null);

  // Collect all images from the service including cover and section images
  const allImages = useMemo(() => {
    const images = service?.coverUrl ? [{ url: service.coverUrl }] : [];
    service?.sections.forEach((section) => {
      images.push(...section.images);
    });
    return images;
  }, [service]);
  if (isPending || error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background py-16">
        <Spinner size="large" />
      </div>
    );
  }
  return (
    <article className="min-h-screen bg-background py-16">
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[400px] w-full overflow-hidden">
        <img
          src={service.coverUrl ? service.coverUrl : "/placeholder.svg"}
          alt={service.nom}
          className="h-full w-full cursor-pointer object-cover"
          onClick={() => setSelectedImage(service.coverUrl)}
          onError={(e) => {
            e.target.src = "https://placehold.co/1200x600/png";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-background/20" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto max-w-[90dvw]">
            <Link
              to="/services"
              className="mb-4 inline-flex items-center text-primary hover:underline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux services
            </Link>
            <h1 className="mb-4 text-4xl font-bold">{service.nom}</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-[90dvw] px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Service Description */}
            <div className="prose prose-lg mb-12 max-w-none">
              <p className="text-xl leading-relaxed text-muted-foreground">
                {service.description}
              </p>
            </div>

            {/* Service Sections */}
            <div className="space-y-16">
              {service.sections.map((section, index) => (
                <section
                  key={section.id}
                  className="scroll-mt-16"
                  id={`section-${section.id}`}
                >
                  <h2 className="mb-6 text-2xl font-bold">{section.title}</h2>
                  <div className="prose prose-lg mb-8 max-w-none">
                    <p>{section.paragraph}</p>
                  </div>
                  {section.images.length > 0 && (
                    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                      {section.images.map((image, imageIndex) => (
                        <div
                          key={imageIndex}
                          className="relative aspect-video cursor-pointer overflow-hidden rounded-lg"
                          onClick={() => setSelectedImage(image.url)}
                        >
                          <img
                            src={image.url ? image.url : "/placeholder.svg"}
                            alt={`Image ${imageIndex + 1} for ${section.title}`}
                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                            onError={(e) => {
                              e.target.src = "https://placehold.co/800x450/png";
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {index < service.sections.length - 1 && (
                    <Separator className="mt-16" />
                  )}
                </section>
              ))}
            </div>

            {/* Image Gallery Carousel */}
            {allImages.length > 0 && (
              <div className="mt-16">
                <h2 className="mb-6 text-2xl font-bold">
                  Galerie d&apos;images
                </h2>
                <ImageCarousel
                  images={allImages}
                  onImageClick={(imageUrl) => setSelectedImage(imageUrl)}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-8 space-y-6">
              {/* Author Card */}

              {/* Table of Contents */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-lg font-semibold">Contenu</h2>
                  <nav className="space-y-2">
                    {service.sections.map((section, index) => (
                      <a
                        key={section.id}
                        href={`#section-${section.id}`}
                        className="block text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {index + 1}. {section.title}
                      </a>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage}
      />
    </article>
  );
}
