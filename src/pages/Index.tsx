
import { useState } from "react";
import { RunwareService, type GeneratedImage } from "@/utils/runware";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Index = () => {
  const [apiKey, setApiKey] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [numImages, setNumImages] = useState(1);
  const [runwareService, setRunwareService] = useState<RunwareService | null>(null);

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      setRunwareService(new RunwareService(apiKey));
      toast.success("API key set successfully");
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!runwareService) {
      toast.error("Please set your API key first");
      return;
    }
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setLoading(true);
    try {
      const results = [];
      for (let i = 0; i < numImages; i++) {
        const result = await runwareService.generateImage({
          positivePrompt: prompt,
          numberResults: 1,
        });
        results.push(result);
      }
      setImages((prev) => [...results, ...prev]);
      toast.success("Images generated successfully!");
    } catch (error) {
      toast.error("Failed to generate images");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center animate-fade-up">
          <h1 className="text-4xl font-bold tracking-tight">AI Image Generator</h1>
          <p className="mt-2 text-muted-foreground">
            Transform your ideas into stunning visuals
          </p>
        </div>

        {!runwareService && (
          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle>Set Your API Key</CardTitle>
              <CardDescription>
                Enter your Runware API key to start generating images
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleApiKeySubmit} className="space-y-4">
                <Input
                  type="password"
                  placeholder="Enter your API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <Button type="submit" className="w-full">
                  Set API Key
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {runwareService && (
          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle>Generate Images</CardTitle>
              <CardDescription>
                Enter a prompt to generate your images
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Number of images: {numImages}
                  </label>
                  <Slider
                    value={[numImages]}
                    onValueChange={(values) => setNumImages(values[0])}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
                <Input
                  placeholder="Eg: Generate an image of teacher giving a lecture to students....."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Generating..." : "Generate"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {images.map((image, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader>
                  <CardDescription className="text-sm truncate">
                    {image.positivePrompt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <img
                    src={image.imageURL}
                    alt={image.positivePrompt}
                    className="w-full h-auto object-cover aspect-square"
                    loading="lazy"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
