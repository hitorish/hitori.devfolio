import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Github, ExternalLink, Award, Brain, Cog, X, Trophy, Play, Clapperboard, ChevronLeft, ChevronRight, Eye, BadgeCheck, BookOpen, FileText, Anchor } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

// 이미지 import
import aifactoryImage from "@/assets/aifactory/aifactory_spark_challenge.jpg";
import aifactoryCeremonyImage from "@/assets/aifactory/202306211707225312_l.jpg";
import knowledgeManagement1 from "@/assets/knowledge_management_1.jpeg";
import knowledgeManagement2 from "@/assets/knowledge_management_2.jpeg";
import loraEvaluatorImage from "@/assets/lora_evaluater.png";
import openkoLlmImage from "@/assets/openko-llm.jpg";
import openkoLlmSponsorImage from "@/assets/openko-llm-sponsor.jpg";
import bocchiImage from "@/assets/bocchi_1.png";
import tensorrtImage from "@/assets/Tensorrt.png";
import onnxImage from "@/assets/onnx.png";
import comfyuiImage from "@/assets/comfyui.svg";
import cudaImage from "@/assets/cuda_logo.png";
import aramcoImage from "@/assets/aramco/award_02.jpg";
import aramcoStageImage from "@/assets/aramco/presentation_02.jpg";
import openkoTeamImage from "@/assets/openko/team.jpg";
import openkoLeaderboardImage from "@/assets/openko/leaderboard.jpg";
import movingtoonImage from "@/assets/movingtoon/ir_pipeline.jpg";
import movingtoonCoreImage from "@/assets/movingtoon/ir_core.jpg";
import movingtoonProcessImage from "@/assets/movingtoon/ir_process.jpg";
import adspImage from "@/assets/certs/adsp.jpg";
import computerCertImage from "@/assets/certs/computer.jpg";
import tensorflowCertImage from "@/assets/certs/tensorflow.jpg";
import navyAwardImage from "@/assets/navy/award.jpg";
import navyAward2025Image from "@/assets/navy/award_2025.jpg";
import bookCoverImage from "@/assets/book/cover.jpg";
import paperImage from "@/assets/paper/first_page.jpg";

// 홀로 카드 컴포넌트
const HoloCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      const rect = card.getBoundingClientRect();
      let x: number, y: number;

      if (e instanceof MouseEvent) {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      } else {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
      }

      const width = rect.width;
      const height = rect.height;
      
      // 마우스 위치를 -1에서 1 사이의 값으로 정규화
      const normalizedX = (x / width) * 2 - 1;
      const normalizedY = (y / height) * 2 - 1;
      
      // 3D 회전 각도 계산 (포켓몬 카드 스타일)
      const rotateX = normalizedY * -15; // Y축 회전 (상하)
      const rotateY = normalizedX * 15;  // X축 회전 (좌우)
      
      // 그라디언트 위치 계산
      const gradientX = (x / width) * 100;
      const gradientY = (y / height) * 100;
      
      // 스파클 효과 위치
      const sparkleX = (x / width) * 100;
      const sparkleY = (y / height) * 100;

      // CSS 변수로 동적 스타일 적용
      card.style.setProperty('--mouse-x', `${gradientX}%`);
      card.style.setProperty('--mouse-y', `${gradientY}%`);
      card.style.setProperty('--sparkle-x', `${sparkleX}%`);
      card.style.setProperty('--sparkle-y', `${sparkleY}%`);
      
      // 3D 변환 적용
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
      
      // 활성 상태 추가
      card.classList.add('active');
    };

    const handleMouseLeave = () => {
      // 원래 상태로 부드럽게 복원
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.classList.remove('active');
      
      // CSS 변수 초기화
      card.style.removeProperty('--mouse-x');
      card.style.removeProperty('--mouse-y');
      card.style.removeProperty('--sparkle-x');
      card.style.removeProperty('--sparkle-y');
    };

    // 이벤트 리스너 등록
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('touchmove', handleMouseMove, { passive: false });
    card.addEventListener('mouseleave', handleMouseLeave);
    card.addEventListener('touchend', handleMouseLeave);

    return () => {
      // 클린업
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('touchmove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
      card.removeEventListener('touchend', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={cardRef} className={`holo-card interactive ${className}`}>
      {children}
    </div>
  );
};

type GalleryImage = { src: string; title: string; description: string };

// 카드 이미지 슬라이더
const ImageCarousel = ({
  images,
  award,
  onOpen,
  startDelay = 0,
}: {
  images: GalleryImage[];
  award?: string;
  onOpen: (image: GalleryImage) => void;
  startDelay?: number;
}) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const current = images[index];
  const hasMany = images.length > 1;

  // 화면에 보일 때만 자동 넘김
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 3초 간격 자동 넘김 (카드마다 시작 시점을 엇갈리게, 호버 시 정지, 동작 줄이기 설정 존중)
  useEffect(() => {
    if (!hasMany || paused || !inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      setIndex((i) => (i + 1) % images.length);
      interval = setInterval(() => setIndex((i) => (i + 1) % images.length), 3000);
    }, 3000 + startDelay);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [hasMany, paused, inView, startDelay, images.length]);

  const go = (e: React.MouseEvent, delta: number) => {
    e.stopPropagation();
    setIndex((i) => (i + delta + images.length) % images.length);
  };

  return (
    <div
      ref={containerRef}
      className="group/carousel mb-4 rounded-lg overflow-hidden cursor-pointer relative bg-gray-100 h-64"
      onClick={() => onOpen(current)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.map((image, i) => (
        <img
          key={image.src}
          src={image.src}
          alt={image.title}
          className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      {award && (
        <div className="pointer-events-none absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1.5 text-sm font-bold text-white shadow-lg ring-2 ring-white/70">
          <Trophy className="h-4 w-4" />
          {award}
        </div>
      )}
      {hasMany && (
        <>
          <button
            type="button"
            aria-label="이전 이미지"
            onClick={(e) => go(e, -1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/40 p-1.5 text-white opacity-70 md:opacity-0 group-hover/carousel:opacity-100 hover:bg-black/60 transition-opacity"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="다음 이미지"
            onClick={(e) => go(e, 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/40 p-1.5 text-white opacity-70 md:opacity-0 group-hover/carousel:opacity-100 hover:bg-black/60 transition-opacity"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 rounded-full bg-black/30 px-2 py-1">
            {images.map((image, i) => (
              <button
                key={image.src}
                type="button"
                aria-label={`${i + 1}번째 이미지`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex(i);
                }}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-4 bg-white" : "w-1.5 bg-white/60"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export const Projects = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ src: string; title: string; description: string; type?: "image" | "video" }>({ src: "", title: "", description: "" });

  // 스크롤 애니메이션 훅들
  const { ref: headerRef, isIntersecting: headerVisible } = useIntersectionObserver<HTMLDivElement>({ threshold: 0.03 });
  const { ref: introRef, isIntersecting: introVisible } = useIntersectionObserver<HTMLDivElement>({ threshold: 0.03 });
  const { ref: marqueeRef, isIntersecting: marqueeVisible } = useIntersectionObserver<HTMLDivElement>({ threshold: 0.03 });
  const { ref: projectsGridRef, isIntersecting: projectsGridVisible } = useIntersectionObserver<HTMLDivElement>({ threshold: 0.03 });

  const openImageModal = (imageSrc: string, title: string, description: string) => {
    setSelectedImage({ src: imageSrc, title, description, type: "image" });
    setModalOpen(true);
  };

  const openVideoModal = (src: string, title: string) => {
    setSelectedImage({ src, title, description: "", type: "video" });
    setModalOpen(true);
  };

  const projects = [
    {
      id: 0,
      title: "Aramco Energy AI Workflow Hackathon",
      award: "2026년 11월 1등",
      description: "화기작업 허가 서류를 과거 사고 패턴과 대조해 작업 승인 · 보완 후 작업 · 작업 불가 · 검토 필요를 판정하는 Document AI 워크플로우입니다.",
      tech: ["Upstage Studio", "Document AI", "LLM Workflow", "Prompt Engineering"],
      image: aramcoImage,
      gallery: [
        { src: aramcoStageImage, title: "본선 발표", description: "Demo Day 본선 영어 발표 (고려대학교 미래융합기술관)" },
      ],
      video: "https://www.youtube.com/embed/o-j__lmaZks",
      category: "Competition",
      icon: <Trophy className="h-6 w-6" />,
      features: [
        "Aramco · 고려대 · Upstage 주최 해커톤 1등",
        "과거 사고 12건에서 판정 조건 10개 도출",
        "서류 누락 · 판독 불가 시 '검토 필요'로 이관",
        "본선 영어 발표"
      ]
    },
    {
      id: 6,
      title: "해군 AI 경진대회",
      award: "2024 · 2025 수상",
      description: "해군 미래혁신연구단 인공지능연구병으로 복무하며 2년 연속 해군 AI 경진대회에서 해군참모총장상을 수상했습니다.",
      tech: ["Unsupervised Learning", "Classification"],
      image: navyAward2025Image,
      gallery: [
        { src: navyAwardImage, title: "2024 해군·해병대 AI 경진대회 상장", description: "팀 '혁신단' 장려상 (해군참모총장, 2024.11.07)" },
      ],
      category: "Competition",
      icon: <Anchor className="h-6 w-6" />,
      features: [
        "2025: 해군·해병대 AI 경진대회에 연구단 대표로 출전, 비지도학습 기반 북한 의심선박 분류 모델로 참모총장상 (해군 · IBK기업은행 · KRISO 공동 주최)",
        "2024: 팀 '혁신단'으로 해군·해병대 AI 경진대회 장려상 (해군참모총장)",
        "해군 미래혁신연구단 인공지능연구병 (2023.12 ~ 2025.08)"
      ]
    },
    {
      id: 5,
      title: "MoovingToon Engine",
      description: "창업한 AI 스타트업 INT4(인트포)의 핵심 서비스로 개발한 무빙툰 제작 엔진입니다. 웹툰 원고(PSD/PSB)를 컷 단위로 나누고, 컷마다 AI 영상을 만들어 무빙툰으로 변환합니다.",
      tech: ["React", "TypeScript", "FastAPI", "CuPy", "ComfyUI", "WAN 2.1", "RunPod", "Docker"],
      image: movingtoonImage,
      gallery: [
        { src: movingtoonProcessImage, title: "무빙툰 엔진 프로세스", description: "PSD → 컷·말풍선 분리 → 구도 및 상황 연출 분석 → 무빙툰 제작" },
        { src: movingtoonCoreImage, title: "AI 무빙툰", description: "자체 제작 툴과 AI로 만드는 고품질 무빙툰 (INT4 IR 자료)" },
      ],
      category: "AI/ML",
      icon: <Clapperboard className="h-6 w-6" />,
      features: [
        "PSD 레이어 GPU 합성 및 컷 자동 분할",
        "말풍선 레이어 추출 및 한글 OCR",
        "로컬 LLM으로 컷별 영상 프롬프트 생성",
        "ComfyUI 영상 생성 워크플로우를 RunPod 서버리스로 배포",
        "AI 웹툰 · 무빙툰 스타트업 INT4 창업 (2025.09 법인 설립)"
      ]
    },
    {
      id: 1,
      title: "Open Ko-LLM 리더보드",
      award: "2023년 11월 우승",
      description: "한국어 초거대 언어 모델(LLM) 성능 평가 및 순위 경쟁 리더보드에서 우승을 차지한 프로젝트입니다. NIA와 업스테이지가 공동 주최하는 대회에서 이달의 LLM을 시상받았습니다.",
      longDescription: "Open Ko-LLM 리더보드는 한국어 LLM의 성능을 평가하고 순위를 경쟁하는 대회로, 추론능력, 상식능력, 언어이해력, 환각방지능력, 한국어 일반상식능력 등 5가지 영역에서 평가합니다. Open-Orca 데이터셋을 번역하고 정제하여 DPO(Direct Preference Optimization) 방식으로 모델을 훈련했습니다.",
      tech: ["PyTorch", "Transformers", "PEFT", "DPO", "RLHF", "Korean LLM", "Fine-tuning"],
      image: openkoLlmImage,
      gallery: [
        { src: openkoTeamImage, title: "미니레코드 AI 개발팀", description: "AI타임스 보도 사진 (2023.11.24)" },
        { src: openkoLeaderboardImage, title: "Open Ko-LLM 리더보드 1·2위", description: "7B 이하 부문 1위 Mini_synatra_7b_02, 2위 Mini_synatra_7b_01" },
        { src: openkoLlmSponsorImage, title: "Open Ko-LLM 스폰서", description: "NIA, 업스테이지, KT Cloud, 고려대학교 nlp & ai Lab, Flitto가 후원하는 대회입니다." },
      ],
      detailLink: "https://www.aitimes.com/news/articleView.html?idxno=155443",
      detailText: "관련 기사",
      category: "Competition",
      icon: <Trophy className="h-6 w-6" />,
      features: [
        "한국어 LLM 성능 평가 및 순위 경쟁",
        "Open-Orca 데이터셋 번역 및 정제",
        "DPO 방식의 효율적인 모델 훈련",
        "5가지 평가 영역 종합 분석",
        "7B 이하 부문 1·2위 (Mini_synatra_7b_02, 평균 49.88점)",
        "NIA-업스테이지 공동 주최 대회 우승"
      ]
    },
    {
      id: 2,
      title: "LoRA Evaluator",
      description: "생성형 인공지능 캐릭터의 얼굴/몸체 등 신체 비율 분석을 통해 LoRA 모델 학습 후 원본과의 유사도를 분석하는 평가 도구입니다. 랜드마크 기반 메트릭을 사용하여 최적의 LoRA 스텝을 찾아줍니다.",
      longDescription: "Facial detection과 body detection을 결합하여 캐릭터가 모델 학습 후 원본과 얼마나 유사한지 분석하는 강력한 도구입니다. 어깨 너비, 허리 너비, 눈 거리, 코-입 거리 등 다양한 비율을 측정하여 수학적으로 최적의 LoRA 스텝을 결정합니다.",
      tech: ["Python", "PyTorch", "MMDetection", "MMPose", "MediaPipe", "CUDA"],
      image: loraEvaluatorImage,
      github: "https://github.com/hitorish/lora-evaluator",
      category: "AI/ML",
      icon: <Brain className="h-6 w-6" />,
      features: [
        "애니메이션 얼굴 검출 및 분석",
        "신체 랜드마크 기반 비율 측정",
        "수학적 평가 함수를 통한 최적화",
        "MMDetection/MMPose 기반 정밀 분석",
        "관련 특허: 「캐릭터 생성 이미지 일관성 검증 방법 및 검증 시스템」 (소속 회사 명의)"
      ]
    },
    {
      id: 3,
      title: "시계열 예측 모델링 - PM2.5 농도 예측",
      award: "AI Factory Spark Challenge 우승",
      description: "다변량 시계열 데이터를 활용한 대기오염 예측 시스템입니다. AI Factory Spark Challenge에서 우승을 차지한 프로젝트로, Python 기반의 머신러닝 파이프라인 구축부터 지리공간 데이터 처리, 시계열 모델링까지 전 과정을 구현했습니다.",
      longDescription: "복합 센서 데이터(PM2.5, 기상 데이터)를 융합하여 시계열 예측 모델을 개발했습니다. 우수한 성적으로 대회 우승을 달성하며, 데이터 전처리, 특성 엔지니어링, 모델 최적화 등 ML 파이프라인 전체를 설계하고 구현한 실력을 입증한 프로젝트입니다.",
      tech: ["LSTM", "XGBoost", "Prophet", "ARIMA", "Optuna", "GeoPandas", "Hyperparameter Tuning", "Ensemble Methods"],
      image: aifactoryImage,
      gallery: [
        { src: aifactoryCeremonyImage, title: "AI SPARK 챌린지 시상식", description: "제5회 연구개발특구 AI SPARK 챌린지 대상 수상 (과학기술정보통신부 · 연구개발특구진흥재단 주최)" },
      ],
      category: "Competition",
      icon: <Award className="h-6 w-6" />,
      detailLink: "https://aifactory.space/task/2317/overview",
      detailText: "대회 개요",
      features: [
        "다변량 시계열 데이터 전처리 파이프라인",
        "지리공간 좌표 기반 특성 엔지니어링",
        "결측치 처리 및 데이터 정합성 검증",
        "교차 검증 기반 모델 성능 최적화",
        "확장 가능한 ML 파이프라인 설계"
      ]
    },
    {
      id: 4,
      title: "CCUS 기술 연구 - GS 칼텍스 협업 (학부)",
      description: "학부 지식경영 수업에서 GS 칼텍스와 협업하여 CCUS(탄소 포집, 활용, 저장) 기술에 대한 연구 프로젝트를 수행했습니다. 화공생명공학 전공 지식을 바탕으로 탄소중립 기술을 분석하고 발표했습니다.",
      longDescription: "실제 석유화학 기업인 GS 칼텍스와의 산학협력 프로젝트로, CCUS 기술의 현황과 전망을 화공생명공학 관점에서 분석했습니다. 공정 설계, 경제성 분석, 환경 영향 평가 등 다각도로 접근한 연구 프로젝트입니다.",
      tech: ["Chemical Engineering", "CCUS Technology", "Process Design", "Economic Analysis", "Presentation", "Industry Collaboration"],
      image: knowledgeManagement1,
      category: "학부 연구",
      icon: <Cog className="h-6 w-6" />,
      detailLink: "https://www.notion.so/KNOWLEDGE-MANAGEMENT-23c683bdd139806695c2d9733a0af5e4?source=copy_link",
      detailText: "PPT 보기",
      features: [
        "GS 칼텍스와의 산학협력 프로젝트",
        "CCUS 기술 현황 및 전망 분석",
        "화공생명공학 관점의 공정 설계",
        "경제성 및 환경 영향 평가",
        "전문적인 프레젠테이션 및 발표"
      ]
    }
  ];

  const projectSections = [
    { id: "awards", title: "수상 실적", ids: [0, 6, 1, 3] },
    { id: "project-list", title: "프로젝트", ids: [5, 2, 4] },
  ].map((section) => ({
    ...section,
    items: section.ids.map((id) => projects.find((project) => project.id === id)!),
  }));

  return (
    <section id="projects" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Personal Introduction with Image */}
        <div 
          ref={introRef}
          className={`mb-16 scroll-animate ${introVisible ? 'animate' : ''}`}
          style={{ transitionDelay: '0s' }}
        >
          <div className="flex flex-col lg:flex-row items-center gap-8 max-w-5xl mx-auto">
            <div className="flex-shrink-0">
              <HoloCard className="bocchi-card w-83 h-80">
                <img
                  src={bocchiImage}
                  alt="AI/ML Research"
                  className="w-full h-full object-cover"
                />
              </HoloCard>
            </div>
            <div className="flex-1 text-center">
              <p className="text-2xl md:text-3xl font-bold text-pink-500 leading-relaxed font-jua">
                "소... 솔직히 AI라는 건 많이 해봤다고 생각해요..."
              </p>
              <p className="text-sm text-yellow-500 mt-2 font-jua">
                "성호야 그게 무슨 소리니?"
              </p>
            </div>
          </div>
        </div>

        {/* Tech Logo Marquee */}
        <div 
          ref={marqueeRef}
          className={`mb-24 scroll-animate ${marqueeVisible ? 'animate' : ''}`}
          style={{ transitionDelay: '0s' }}
        >
          <h3 className="text-xl font-bold mb-8 text-center text-muted-foreground">Tech Stack</h3>
          <div className="overflow-hidden">
            <div className="flex animate-marquee py-4 whitespace-nowrap">
              <div className="flex items-center space-x-8">
                {/* 첫 번째 세트 */}
                {/* Python */}
                <div className="flex flex-col items-center space-y-2 flex-shrink-0" style={{ width: '6rem' }}>
                  <div className="w-12 h-12 bg-white rounded-lg p-2 shadow-lg">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python" className="w-full h-full" />
                  </div>
                  <span className="text-xs text-muted-foreground text-center">Python</span>
                </div>
                
                {/* PyTorch */}
                <div className="flex flex-col items-center space-y-2 flex-shrink-0" style={{ width: '6rem' }}>
                  <div className="w-12 h-12 bg-white rounded-lg p-2 shadow-lg">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" alt="PyTorch" className="w-full h-full" />
                  </div>
                  <span className="text-xs text-muted-foreground text-center">PyTorch</span>
                </div>

                {/* TensorFlow */}
                <div className="flex flex-col items-center space-y-2 flex-shrink-0" style={{ width: '6rem' }}>
                  <div className="w-12 h-12 bg-white rounded-lg p-2 shadow-lg">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" alt="TensorFlow" className="w-full h-full" />
                  </div>
                  <span className="text-xs text-muted-foreground text-center">TensorFlow</span>
                </div>

                {/* Docker */}
                <div className="flex flex-col items-center space-y-2 flex-shrink-0" style={{ width: '6rem' }}>
                  <div className="w-12 h-12 bg-white rounded-lg p-2 shadow-lg">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" alt="Docker" className="w-full h-full" />
                  </div>
                  <span className="text-xs text-muted-foreground text-center">Docker</span>
                </div>

                {/* FastAPI */}
                <div className="flex flex-col items-center space-y-2 flex-shrink-0" style={{ width: '6rem' }}>
                  <div className="w-12 h-12 bg-white rounded-lg p-2 shadow-lg">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" alt="FastAPI" className="w-full h-full" />
                  </div>
                  <span className="text-xs text-muted-foreground text-center">FastAPI</span>
                </div>

                {/* Supabase */}
                <div className="flex flex-col items-center space-y-2 flex-shrink-0" style={{ width: '6rem' }}>
                  <div className="w-12 h-12 bg-white rounded-lg p-2 shadow-lg">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg" alt="Supabase" className="w-full h-full" />
                  </div>
                  <span className="text-xs text-muted-foreground text-center">Supabase</span>
                </div>

                {/* Git */}
                <div className="flex flex-col items-center space-y-2 flex-shrink-0" style={{ width: '6rem' }}>
                  <div className="w-12 h-12 bg-white rounded-lg p-2 shadow-lg">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" alt="Git" className="w-full h-full" />
                  </div>
                  <span className="text-xs text-muted-foreground text-center">Git</span>
                </div>

                {/* GitHub */}
                <div className="flex flex-col items-center space-y-2 flex-shrink-0" style={{ width: '6rem' }}>
                  <div className="w-12 h-12 bg-white rounded-lg p-2 shadow-lg">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" className="w-full h-full" />
                  </div>
                  <span className="text-xs text-muted-foreground text-center">GitHub</span>
                </div>

                {/* Redis */}
                <div className="flex flex-col items-center space-y-2 flex-shrink-0" style={{ width: '6rem' }}>
                  <div className="w-12 h-12 bg-white rounded-lg p-2 shadow-lg">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" alt="Redis" className="w-full h-full" />
                  </div>
                  <span className="text-xs text-muted-foreground text-center">Redis</span>
                </div>

                {/* TensorRT */}
                <div className="flex flex-col items-center space-y-2 flex-shrink-0" style={{ width: '6rem' }}>
                  <div className="w-12 h-12 bg-white rounded-lg p-1 shadow-lg">
                    <img src={tensorrtImage} alt="TensorRT" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs text-muted-foreground text-center">TensorRT</span>
                </div>

                {/* ONNX */}
                <div className="flex flex-col items-center space-y-2 flex-shrink-0" style={{ width: '6rem' }}>
                  <div className="w-12 h-12 bg-white rounded-lg p-2 shadow-lg">
                    <img src={onnxImage} alt="ONNX" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs text-muted-foreground text-center">ONNX</span>
                </div>

                {/* Hugging Face */}
                <div className="flex flex-col items-center space-y-2 flex-shrink-0" style={{ width: '6rem' }}>
                  <div className="w-12 h-12 bg-white rounded-lg p-2 shadow-lg">
                    <img src="https://huggingface.co/front/assets/huggingface_logo.svg" alt="Hugging Face" className="w-full h-full" />
                  </div>
                  <span className="text-xs text-muted-foreground text-center">Hugging Face</span>
                </div>

                {/* ComfyUI */}
                <div className="flex flex-col items-center space-y-2 flex-shrink-0" style={{ width: '6rem' }}>
                  <div className="w-12 h-12 bg-white rounded-lg p-2 shadow-lg">
                    <img src={comfyuiImage} alt="ComfyUI" className="w-full h-full" />
                  </div>
                  <span className="text-xs text-muted-foreground text-center">ComfyUI</span>
                </div>

                {/* CUDA */}
                <div className="flex flex-col items-center space-y-2 flex-shrink-0" style={{ width: '6rem' }}>
                  <div className="w-12 h-12 bg-white rounded-lg p-2 shadow-lg flex items-center justify-center">
                    <img src={cudaImage} alt="CUDA" className="w-full h-full" />
                  </div>
                  <span className="text-xs text-muted-foreground text-center">CUDA</span>
                </div>

                {/* 두 번째 세트 (동일한 내용) */}
                {/* Python */}
                <div className="flex flex-col items-center space-y-2 flex-shrink-0" style={{ width: '6rem' }}>
                  <div className="w-12 h-12 bg-white rounded-lg p-2 shadow-lg">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python" className="w-full h-full" />
                  </div>
                  <span className="text-xs text-muted-foreground text-center">Python</span>
                </div>
                
                {/* PyTorch */}
                <div className="flex flex-col items-center space-y-2 flex-shrink-0" style={{ width: '6rem' }}>
                  <div className="w-12 h-12 bg-white rounded-lg p-2 shadow-lg">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" alt="PyTorch" className="w-full h-full" />
                  </div>
                  <span className="text-xs text-muted-foreground text-center">PyTorch</span>
                </div>

                {/* TensorFlow */}
                <div className="flex flex-col items-center space-y-2 flex-shrink-0" style={{ width: '6rem' }}>
                  <div className="w-12 h-12 bg-white rounded-lg p-2 shadow-lg">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" alt="TensorFlow" className="w-full h-full" />
                  </div>
                  <span className="text-xs text-muted-foreground text-center">TensorFlow</span>
                </div>

                {/* Docker */}
                <div className="flex flex-col items-center space-y-2 flex-shrink-0" style={{ width: '6rem' }}>
                  <div className="w-12 h-12 bg-white rounded-lg p-2 shadow-lg">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" alt="Docker" className="w-full h-full" />
                  </div>
                  <span className="text-xs text-muted-foreground text-center">Docker</span>
                </div>

                {/* FastAPI */}
                <div className="flex flex-col items-center space-y-2 flex-shrink-0" style={{ width: '6rem' }}>
                  <div className="w-12 h-12 bg-white rounded-lg p-2 shadow-lg">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" alt="FastAPI" className="w-full h-full" />
                  </div>
                  <span className="text-xs text-muted-foreground text-center">FastAPI</span>
                </div>

                {/* Supabase */}
                <div className="flex flex-col items-center space-y-2 flex-shrink-0" style={{ width: '6rem' }}>
                  <div className="w-12 h-12 bg-white rounded-lg p-2 shadow-lg">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg" alt="Supabase" className="w-full h-full" />
                  </div>
                  <span className="text-xs text-muted-foreground text-center">Supabase</span>
                </div>

                {/* Git */}
                <div className="flex flex-col items-center space-y-2 flex-shrink-0" style={{ width: '6rem' }}>
                  <div className="w-12 h-12 bg-white rounded-lg p-2 shadow-lg">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" alt="Git" className="w-full h-full" />
                  </div>
                  <span className="text-xs text-muted-foreground text-center">Git</span>
                </div>

                {/* GitHub */}
                <div className="flex flex-col items-center space-y-2 flex-shrink-0" style={{ width: '6rem' }}>
                  <div className="w-12 h-12 bg-white rounded-lg p-2 shadow-lg">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" className="w-full h-full" />
                  </div>
                  <span className="text-xs text-muted-foreground text-center">GitHub</span>
                </div>

                {/* Redis */}
                <div className="flex flex-col items-center space-y-2 flex-shrink-0" style={{ width: '6rem' }}>
                  <div className="w-12 h-12 bg-white rounded-lg p-2 shadow-lg">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" alt="Redis" className="w-full h-full" />
                  </div>
                  <span className="text-xs text-muted-foreground text-center">Redis</span>
                </div>

                {/* TensorRT */}
                <div className="flex flex-col items-center space-y-2 flex-shrink-0" style={{ width: '6rem' }}>
                  <div className="w-12 h-12 bg-white rounded-lg p-1 shadow-lg">
                    <img src={tensorrtImage} alt="TensorRT" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs text-muted-foreground text-center">TensorRT</span>
                </div>

                {/* ONNX */}
                <div className="flex flex-col items-center space-y-2 flex-shrink-0" style={{ width: '6rem' }}>
                  <div className="w-12 h-12 bg-white rounded-lg p-2 shadow-lg">
                    <img src={onnxImage} alt="ONNX" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs text-muted-foreground text-center">ONNX</span>
                </div>

                {/* Hugging Face */}
                <div className="flex flex-col items-center space-y-2 flex-shrink-0" style={{ width: '6rem' }}>
                  <div className="w-12 h-12 bg-white rounded-lg p-2 shadow-lg">
                    <img src="https://huggingface.co/front/assets/huggingface_logo.svg" alt="Hugging Face" className="w-full h-full" />
                  </div>
                  <span className="text-xs text-muted-foreground text-center">Hugging Face</span>
                </div>

                {/* ComfyUI */}
                <div className="flex flex-col items-center space-y-2 flex-shrink-0" style={{ width: '6rem' }}>
                  <div className="w-12 h-12 bg-white rounded-lg p-2 shadow-lg">
                    <img src={comfyuiImage} alt="ComfyUI" className="w-full h-full" />
                  </div>
                  <span className="text-xs text-muted-foreground text-center">ComfyUI</span>
                </div>

                {/* CUDA */}
                <div className="flex flex-col items-center space-y-2 flex-shrink-0" style={{ width: '6rem' }}>
                  <div className="w-12 h-12 bg-white rounded-lg p-2 shadow-lg flex items-center justify-center">
                    <img src={cudaImage} alt="CUDA" className="w-full h-full" />
                  </div>
                  <span className="text-xs text-muted-foreground text-center">CUDA</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Divider */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-primary/60 rounded-full shadow-lg"></div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div 
          ref={headerRef}
          className={`text-center mb-16 scroll-animate ${headerVisible ? 'animate' : ''}`}
        >
          <Badge variant="outline" className="mb-4">Projects & Achievements</Badge>
          <h2 id="projects-header" className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            성과와 프로젝트
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            수상 실적, 프로젝트, 논문과 저서입니다
          </p>
        </div>

        <div ref={projectsGridRef}>
          {projectSections.map((section) => (
            <div key={section.id} id={section.id} className="mb-16 scroll-mt-24">
              <h3 className="text-2xl font-bold mb-8">{section.title}</h3>
            <div 
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 scroll-animate ${projectsGridVisible ? 'animate' : ''}`}
              style={{ transitionDelay: '0s' }}
            >
              {section.items.map((project, cardIndex) => (
                <Card 
                  key={project.id} 
                  className={`group hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50 bg-card/50 backdrop-blur h-full flex flex-col scroll-animate-stagger ${projectsGridVisible ? 'animate' : ''}`}
                  style={{ transitionDelay: '0s' }}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          {project.icon}
                        </div>
                        <Badge variant="secondary">{project.category}</Badge>
                      </div>
                    </div>
                
                    {project.image && (
                      <ImageCarousel
                        images={[{ src: project.image, title: project.title, description: project.description }, ...(project.gallery ?? [])]}
                        award={project.award}
                        startDelay={cardIndex * 1000}
                        onOpen={(image) => openImageModal(image.src, image.title, image.description)}
                      />
                    )}

                    <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {project.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-grow">
                    <div className="space-y-4">
                      {project.features.length > 0 && <div>
                        <h4 className="font-semibold mb-2 text-sm">주요 성과:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {project.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>}
                  
                      <div className="flex flex-wrap gap-1">
                        {project.tech.map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex gap-2">
                    {project.video && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => openVideoModal(project.video, project.title)}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        발표 영상
                      </Button>
                    )}
                    {project.github && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => window.open(project.github, '_blank')}
                      >
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </Button>
                    )}
                    {project.detailLink && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => project.detailLink.startsWith('#') ? document.querySelector(project.detailLink)?.scrollIntoView({ behavior: 'smooth' }) : window.open(project.detailLink, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {project.detailText}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
            </div>
          ))}
        </div>

        {/* Publications & Certifications */}
        <div id="publications" className="mb-16 scroll-mt-24">
          <h3 className="text-2xl font-bold mb-8">논문 · 저서</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                type: "저서",
                icon: BookOpen,
                title: "LLM 활용과 국방",
                meta: "AI 문고 · 커뮤니케이션북스 · 2026.04",
                authors: "이성호, 이소울, 유희철, 박상수, 김우현",
                image: bookCoverImage,
                description: "할루시네이션, 프롬프트 인젝션, 폐쇄망 데이터 보안, 모델 편향성, 경량화·실시간 추론 등 국방 분야 LLM 활용의 리스크와 대응 전략을 다룬 책입니다. 아래 논문을 다듬어 출간했습니다.",
                link: "https://product.kyobobook.co.kr/detail/S000219785908",
                linkText: "교보문고",
              },
              {
                type: "논문",
                icon: FileText,
                title: "국방 분야에서의 LLM 활용 문제점과 해결 전략",
                meta: "국방과 보안 제6권 제1호 · 2024.06 · pp.302-328",
                authors: "이소울, 이성호, 유희철, 박상수, 김우현",
                image: paperImage,
                description: "국방이라는 특수한 환경에서 LLM을 사용할 때 생기는 문제점을 식별하고 해결 방안을 제시했습니다. 해군 미래혁신연구단 재직 중 작성했습니다.",
                link: "https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE12393526",
                linkText: "DBpia",
              },
            ].map(({ type, icon: Icon, title, meta, authors, image, description, link, linkText }) => (
              <Card key={title} className="bg-card/50 flex flex-col hover:border-primary/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant="secondary">{type}</Badge>
                  </div>
                  <div className="group mb-4 rounded-lg overflow-hidden cursor-pointer relative" onClick={() => openImageModal(image, title, meta)}>
                    <img
                      src={image}
                      alt={title}
                      className="w-full h-64 object-contain bg-gray-100 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                      <div className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-lg">
                        클릭하여 확대
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{title}</CardTitle>
                  <p className="text-xs text-muted-foreground">{meta}</p>
                </CardHeader>
                <CardContent className="flex-grow space-y-2 text-sm">
                  <p className="text-muted-foreground leading-relaxed">{description}</p>
                  <p className="text-xs text-muted-foreground">저자: {authors}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => window.open(link, '_blank')}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {linkText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <h3 className="text-2xl font-bold mb-6">자격증</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { date: "2023.06 (2026.06 만료)", name: "TensorFlow Developer Certificate", issuer: "Google TensorFlow", image: tensorflowCertImage },
              { date: "2023.06", name: "ADsP (데이터분석 준전문가)", issuer: "한국데이터산업진흥원", image: adspImage },
              { date: "2021.03", name: "컴퓨터활용능력 1급", issuer: "대한상공회의소", image: computerCertImage },
            ].map((cert) => (
              <Card key={cert.name} className="bg-card/50 flex flex-col hover:border-primary/50 transition-colors">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BadgeCheck className="h-5 w-5 text-primary flex-shrink-0" />
                    {cert.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{cert.issuer} · {cert.date}</p>
                </CardHeader>
                <CardFooter className="mt-auto">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => openImageModal(cert.image, cert.name, `${cert.issuer} · ${cert.date}`)}>
                    <Eye className="h-4 w-4 mr-2" />
                    자격증 보기
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Image Modal */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] p-0">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
                onClick={() => setModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="overflow-hidden rounded-lg bg-black">
                {selectedImage.type === "video" ? (
                  <div className="aspect-video w-full">
                    <iframe
                      key={selectedImage.src}
                      src={`${selectedImage.src}?autoplay=1&rel=0`}
                      title={selectedImage.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <img
                    src={selectedImage.src}
                    alt={selectedImage.title}
                    className="w-full h-auto max-h-[80vh] object-contain"
                  />
                )}
              </div>
              <div className="p-6 bg-background">
                <h3 className="text-xl font-bold mb-2">{selectedImage.title}</h3>
                <p className="text-muted-foreground">{selectedImage.description}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}; 