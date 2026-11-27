import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

const techCategories = [
  {
    title: "LLM",
    description: "파인튜닝, RAG, Agent",
    techs: ["Axolotl", "Mistral 7B/22B", "Llama 2/3", "Qwen 1.5/2", "RAG", "LLM Agent"],
  },
  {
    title: "Generative AI",
    description: "이미지 생성 모델 학습과 워크플로우 자동화",
    techs: ["SD 1.5/SDXL", "ComfyUI", "Kohya_ss", "OneTrainer", "LoRA Training"],
  },
  {
    title: "Computer Vision",
    description: "실시간 얼굴 인식·변환, 이미지 복원",
    techs: ["ArcFace", "RetinaNet", "XSeg", "GFPGAN", "CodeFormer", "Inswapper", "DFM"],
  },
  {
    title: "Inference",
    description: "모델 경량화와 추론 최적화",
    techs: ["ONNX Runtime", "TensorRT", "Execution Provider", "CuPy", "Quantization (fp16 · bf16 · int8 · gguf)"],
  },
  {
    title: "Development",
    description: "AI 애플리케이션과 서빙",
    techs: ["PyTorch Lightning", "TensorFlow/Keras", "FastAPI", "Docker", "Supabase", "React/TypeScript"],
  },
  {
    title: "Infrastructure",
    description: "GPU 학습·배포 환경",
    techs: ["A100/H100", "Multi-GPU Training", "RunPod Serverless", "Model Serving", "MLOps"],
  },
];

export const TechStack = () => {
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({ threshold: 0.05 });

  return (
    <section id="tech-stack" className="py-24 px-6 bg-background">
      <div
        ref={ref}
        className={`max-w-5xl mx-auto scroll-animate ${isIntersecting ? 'animate' : ''}`}
      >
        <div className="mb-10">
          <h2 id="tech-stack-header" className="text-3xl font-bold mb-2">기술 스택</h2>
          <p className="text-muted-foreground">실무와 프로젝트에서 사용한 기술입니다</p>
        </div>

        <dl className="divide-y border-y">
          {techCategories.map((category) => (
            <div key={category.title} className="grid gap-3 py-6 md:grid-cols-[14rem_1fr] md:gap-8">
              <dt>
                <div className="font-semibold">{category.title}</div>
                <div className="text-sm text-muted-foreground">{category.description}</div>
              </dt>
              <dd className="flex flex-wrap items-start gap-2">
                {category.techs.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border bg-muted/40 px-2.5 py-1 text-sm text-foreground/80"
                  >
                    {tech}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
