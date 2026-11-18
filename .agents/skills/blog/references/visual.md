# Visual Assets & Cloudinary Guide

이 문서는 블로그 글의 시각 자료(다이어그램, 대표 썸네일, 본문 일러스트/사진) 생성 및 **Cloudinary MCP 업로드 파이프라인** 가이드입니다.

---

## 1. 시각 자료 분업 및 적극 활용 원칙

Git 저장소와 Netlify 빌드·대역폭을 가볍게 유지하면서 독자의 이해도와 체류 시간을 높이기 위해, 텍스트만으로 빽빽한 구성을 피하고 아래 기준에 따라 시각 에셋을 **적극 조합**합니다.

| 시각 자료 유형 | 담당 도구 / 컴포넌트 | 권장 활용 시점 및 분량 |
| :--- | :--- | :--- |
| **구조 · 파이프라인 · 의사결정 흐름** | `Mermaid` 코드 블록 (`writer` 직접 작성) | 아키텍처, 상태 전이, 분기 선택지 설명 시 |
| **통계 수치 · 24시간 타임라인** | `<Chart>` · `<ClockChart>` (`writer` 직접 작성) | 정량 비교, 증시/루틴 시간대 시각화 시 |
| **대표 썸네일 (필수)** | `image-generator` → **Cloudinary MCP** | 모든 포스트 1장 (`16:9`, frontmatter `thumbnail`) |
| **본문 개념 일러스트 · 비교 그래픽** | `image-generator` → **Cloudinary MCP** → `<CloudinaryImage>` / `<ImageRow>` | 표준 글 **1～2장**, 심층 글 **2～4장** 적극 배치 (추상 개념 메타포, Before/After 대비, 핵심 시나리오 묘사) |
| **기존 보유 사진 · 밈 · 스크린샷** | **Cloudinary MCP (`search-assets` / `upload-asset`)** → `<CloudinaryImage>` | 계정의 기존 `media/...` · `library/...` 에셋 재사용 또는 사용자 로컬 이미지 업로드 시 |

---

## 2. Mermaid 다이어그램 작성 요령

Astro 블로그 본문에서 기술 아키텍처, 파이프라인, 버전 선택 플로우차트를 시각화할 때 사용합니다.

````markdown
```mermaid
flowchart LR
    A["클라이언트 요청"] --> B["Astro 정적 빌드"]
    B --> C{"캐시 히트?"}
    C -- Yes --> D["정적 HTML 반환"]
    C -- No --> E["데이터 조회 & 렌더링"]
```
````

- **주의사항**:
  - 괄호(`()`), 대괄호(`[]`), 슬래시(`/`) 등 특수문자가 포함된 노드 라벨은 반드시 큰따옴표(`id["Label (Extra Info)"]`)로 감쌉니다.
  - 노드 라벨 내부에 HTML 태그(`<br/>` 등)를 넣지 않고 줄바꿈(`\n`) 또는 간결한 문구를 사용합니다.
  - 지원되는 표준 다이어그램 유형(`flowchart TD/LR`, `sequenceDiagram`, `stateDiagram-v2`, `classDiagram`, `erDiagram`, `xychart-beta`)만 사용합니다.

---

## 3. AI 이미지 적극 생성 가이드 (`image-generator`)

대표 썸네일뿐 아니라, 텍스트 설명만으로는 직관성이 떨어지는 **핵심 개념 도입부·대조 구간·실전 시나리오**에 `image-generator` 서브에이전트(`TypeName: "image-generator"`, `Role: "Visual Illustrator"`)를 병렬 호출하여 일러스트를 생성합니다.

> **파일 생성 특성**:
> - `image-generator`는 워크스페이스 `public/`에 직접 파일을 쓰지 않고 **대화 아티팩트 디렉터리(`<appDataDir>/brain/<conversation-id>/`)에 이미지(기본 `.jpg`)를 저장한 뒤 절대 경로를 반환**합니다.
> - 생성된 파일은 `public/images/posts/`로 복사하지 않고(Git 워킹트리 오염 0), **곧바로 Cloudinary MCP로 업로드**합니다.

### ① 대표 썸네일 프롬프트 템플릿 (`16:9`)
```text
다음 블로그 포스트의 16:9 와이드 대표 썸네일 이미지를 생성해줘:
- 주제: [포스트 핵심 주제 및 상징 오브젝트]
- 분위기: 모던, 미니멀, 에디토리얼 테크/라이프 일러스트레이션, 세련된 조명과 깊이감 있는 배경
- 제약사항: 이미지 안에 텍스트, 글자, 알파벳, 한글, 숫자, 워터마크를 절대 넣지 말고 순수 그래픽·시각적 메타포로만 구성해줘.
```

### ② 본문 섹션 일러스트 프롬프트 템플릿 (`16:9` 또는 `4:3`, 비교 시 2장 세트)
```text
블로그 본문 '[H2 섹션 주제]' 단락의 이해를 돕는 직관적인 에디토리얼 일러스트를 생성해줘:
- 표현할 핵심 장면/대비: [예: 단일 스레드가 블로킹되어 대기 줄이 밀린 모습 vs 가상 스레드가 가볍게 분기 처리되는 모습]
- 스타일: 본문 썸네일과 톤앤매너가 이어지는 깔끔한 모던 일러스트레이션, 명확한 시각적 대비
- 제약사항: 이미지 내부에 텍스트, 라벨, 글자, 숫자를 절대 포함하지 말 것(깨진 글자 방지 — 캡션과 설명은 마크다운 본문에서 처리함).
```

---

## 4. Cloudinary MCP 업로드 및 MDX 삽입 규격

이 프로젝트는 전역 `cloudinary` MCP 서버(`@cloudinary/asset-management-mcp`, `--mode dynamic`, Cloud Name: `doal3ofyr`)와 연동되어 있습니다.

### ① 폴더 및 네이밍 컨벤션
- **포스트 전용 폴더 경로**: `posts/{섹션}/{연도}/{slug}` (예: `posts/dev/2026/spring-virtual-threads`)
- **파일 식별자(`public_id` 단말명)**:
  - 대표 썸네일: `thumbnail`
  - 본문 이미지: `fig-01-{영문키워드}`, `fig-02-{영문키워드}` (예: `fig-01-thread-comparison`)
- **기존 에셋 검색**: 계정에 이미 정리된 `media/...`, `library/...` 이미지를 재사용할 때는 `search-assets` 툴(`request: { expression: "resource_type:image AND ...", max_results: 10 }`)로 먼저 조회할 수 있습니다.

### ② MCP 업로드 호출 방법 (`--mode dynamic`)
1. 세션 내 첫 호출 시 `call_mcp_tool` (`ServerName: "cloudinary"`, `ToolName: "describe_tool_input"`, `Arguments: { "tool_names": ["upload-asset"] }`)로 입력 스키마를 확인합니다.
2. `execute_tool`로 `upload-asset`을 실행합니다:
   ```json
   {
     "name": "upload-asset",
     "arguments": {
       "resource_type": "image",
       "upload_request": {
         "file": "file:///Users/.../brain/.../generated-image.jpg",
         "folder": "posts/dev/2026/my-post-slug",
         "public_id": "thumbnail",
         "overwrite": true
       }
     }
   }
   ```
   > **⚠️ 필수 주의사항**:
   > - `upload_request.file`에 로컬 파일을 넘길 때는 **반드시 `file://` 접두사**(`file:///절대경로`)를 붙여야 합니다.
   > - 이미 `folder`에 `posts/{섹션}/{연도}/{slug}`를 지정했으므로 `public_id`에는 폴더 경로를 중복해서 적지 않고 파일명(`"thumbnail"`, `"fig-01-..."`)만 적습니다. 업로드 완료 후 **응답 JSON의 `public_id`(전체 경로 포함, 예: `"posts/dev/2026/my-post-slug/thumbnail"`), `width`, `height` 값을 그대로 사용**합니다.

### ③ Frontmatter 및 본문 MDX 반영 규격

1. **대표 썸네일 (`thumbnail` frontmatter)**
   - 카카오톡·슬랙·디스코드 등 일부 메신저 OG 크롤러는 AVIF 이미지를 미리보기로 렌더링하지 못하므로, `thumbnail` URL은 반드시 **`w_1200,q_auto,f_jpg`** 변환을 명시합니다:
   ```yaml
   thumbnail: "https://res.cloudinary.com/doal3ofyr/image/upload/w_1200,q_auto,f_jpg/posts/dev/2026/my-post-slug/thumbnail"
   ```

2. **본문 단일 이미지 (`CloudinaryImage.astro`)**
   - 레이아웃 시프트(CLS) 방지를 위해 업로드 응답에서 받은 원본 **`width`와 `height`를 반드시 함께 기입**하고, SEO를 위한 구체적인 `alt` 설명을 작성합니다:
   ```mdx
   import CloudinaryImage from '@/components/CloudinaryImage.astro';

   <CloudinaryImage
     publicId="posts/dev/2026/my-post-slug/fig-01-overview"
     width={1408}
     height={768}
     alt="기존 스레드 풀 병목 구조와 가상 스레드 경량 스케줄링 흐름을 대비한 일러스트"
   />
   ```

3. **본문 다중 비교·연속 이미지 (`ImageRow.astro` + `CloudinaryImage.astro`)**
   - 2～4장의 Before/After 비교나 단계별 시각 자료는 `<ImageRow>`로 나란히 배치합니다:
   ```mdx
   import ImageRow from '@/components/ImageRow.astro';
   import CloudinaryImage from '@/components/CloudinaryImage.astro';

   <ImageRow cols={2} caption="좌: 블로킹 I/O 대기 발생 시 / 우: 논블로킹 이벤트 루프 처리 시">
     <CloudinaryImage
       publicId="posts/dev/2026/my-post-slug/fig-01-blocking"
       width={1024}
       height={1024}
       alt="요청마다 스레드가 점유되어 대기열이 길어진 모습"
     />
     <CloudinaryImage
       publicId="posts/dev/2026/my-post-slug/fig-02-nonblocking"
       width={1024}
       height={1024}
       alt="단일 이벤트 루프가 비동기 콜백으로 요청을 빠르게 분산하는 모습"
     />
   </ImageRow>
   ```

---

## 5. 오프라인/외부 툴 폴백

만약 네트워크 제한 등으로 Cloudinary 업로드를 수행할 수 없는 예외적인 상황에서만 로컬 `public/images/posts/{연도}/{slug}-thumbnail.{ext}` 복사를 폴백으로 사용하거나, 사용자가 직접 외부 툴(Midjourney 등)로 생성하길 원할 때 구조화된 영문 프롬프트(`--no text, letters, numbers, watermark` 포함)를 제공합니다.
