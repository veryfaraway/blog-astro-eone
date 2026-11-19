# Visual Assets & Cloudinary Guide

이 문서는 블로그 글의 시각 자료(다이어그램, 커스텀 SVG 도식, 기존/외부 실사 에셋, AI 이미지, 대표 썸네일) 기획 원칙 및 **Cloudinary MCP 업로드 파이프라인** 가이드입니다.

---

## 1. 핵심 철학: "단락 구분·장식이 아닌 내용 이해 (Comprehension Over Decoration)"

본문 시각 자료의 목적은 허전한 여백을 메우거나 소제목 밑을 꾸미는 것이 아니라 **독자가 본문 내용을 더 직관적으로 이해하고 구체적인 대상을 떠올리게 돕는 것**입니다.

### ① 의무 할당량 폐지 (`0장 ～ N장` 완전 자율)
- **대표 썸네일(`thumbnail`, `16:9` 1장)**: 모든 포스트에 필수입니다.
- **본문 이미지(`0장 ～ 제한 없음`)**: "표준 글 1～2장, 심층 글 2～4장" 같은 기계적 할당량은 두지 않습니다.
  - **코드 설명·백엔드·트러블슈팅 등 IT/개발 글**: 억지로 추상 일러스트를 만들지 마세요. 코드 스니펫, `Mermaid`, `<Chart>`, 커스텀 SVG 도식만으로 충분하다면 **본문 래스터 이미지는 `0장`이어도 완전히 정상**입니다.
  - **시각적 심상·실물·현장감이 중요한 글**: 절기·역사, 제품 구성, 인물 이야기, 여행기 등 이미지가 이해와 몰입을 직접 돕는 주제라면 **개수에 구애받지 말고 필요한 지점마다 자연스럽게 배치**합니다.

### ② 삽입 전 판별 기준 (Visual Value Gate)
본문에 이미지를 넣기 전 반드시 아래 질문을 통과해야 합니다:
> *"이 이미지를 지웠을 때 독자가 본문 개념·사물·인물·공간을 이해하거나 떠올리기 더 어려워지는가?"*
> - **예** → 삽입 (읽는 포인트를 짚어주는 `caption` 필수 동반)
> - **아니오 (단순히 단락이 길어 보여 넣는 구분선·분위기 배너임)** → **삽입하지 않음**

### ③ 전면 금지 안티패턴 (Anti-Patterns)
- ❌ **억지 추상 메타포·상징물 합성 금지**: 야구 FA 분석 글에 '체스말과 천칭 저울', 기업 공시 분석에 '파도 속 등대'·'빙산', 보안/동시성 글에 '자물쇠와 방패'처럼 본문 대상과 동떨어진 비유 오브젝트를 합성한 감성 배너는 생성하지 않습니다.
- ❌ **H2(`##`) 소제목 직하단 기계적 배너 배치 금지**: 소제목 바로 아래에 문맥 연결 없이 16:9 이미지를 구분선(Section Divider)처럼 꽂아 넣지 않습니다. 반드시 대상을 설명하는 문단 흐름 속에 배치하세요.
- ❌ **무캡션·무연동 방치 금지**: 화면에 보이지 않는 `alt`만 적고 끝내지 않습니다. 본문 이미지에는 독자가 무엇을 주목해 봐야 하는지 알려주는 `caption`을 달고, 앞뒤 문장과 자연스럽게 호흡을 연결합니다.

---

## 2. 시각 자료 수단 선택 우선순위 (5단계 적재적소 매칭)

주제와 설명 대상에 맞춰 아래 순서대로 가장 정보 전달력이 높은 수단을 선택합니다.

| 우선순위 | 시각 자료 수단 | 최적 활용 상황 |
| :--- | :--- | :--- |
| **1순위** | **`Mermaid` · `<Chart>` · `<ClockChart>` · 비교 표 · 전용 Astro 컴포넌트** | 실행 시퀀스·분기 흐름(`Mermaid`), 정량 통계·시간대(`<Chart>`/`<ClockChart>`), 영화·도서·주식·야구·오픈소스·앱·장소 카드 및 인터랙티브 시뮬레이터 |
| **2순위** | **커스텀 반응형 SVG 도식** (`writer` 직접 작성) | 메모리/락 구조, 시스템 계층, 포트·패키지 레이아웃 등 **정확한 한글/영문 라벨과 화살표가 들어가야만 이해되는 기술·구조 도해** (AI 이미지의 글자 깨짐 원천 해결) |
| **3순위** | **계정 내 기존 보유 에셋 재사용** (`Cloudinary search-assets`) | Cloudinary 계정의 `media/person/...`, `media/company/...`, `media/movie/...`, `library/...` 등에 이미 정리된 인물·기업·작품·직찍 사진이 있을 때 |
| **4순위** | **검증된 외부 실사·사료·공식 자료 인용** (`https://` → Cloudinary 업로드) | 역사 유물·사료(예: 1839년 대림환 원형, 고전 성화), 실제 지리·명소 사진, 공식 문서 아키텍처·프레스킷 등 **실제 원본을 보여주는 것이 핵심일 때** (퍼블릭 도메인·CC 라이선스 확인 및 `credit`/`creditUrl` 출처 명시 필수) |
| **5순위** | **`image-generator` AI 본문 이미지 생성** (구체 대상 묘사 전용) | 아래 **4대 적합 유형**(구체적 사물/절기 장면, 제품·공간 구성도, 인물 캐리커처, 여행지 풍경)처럼 구체적 시각 묘사가 내용 이해와 현장감을 살려줄 때 (개수 제한 없음) |

---

## 3. Mermaid 및 커스텀 SVG 도식 작성 요령

### ① Mermaid 다이어그램 (`flowchart`, `sequenceDiagram` 등)
아키텍처 파이프라인, 트랜잭션 타이밍(`sequenceDiagram`), 의사결정 플로우차트를 표현할 때 사용합니다.
- 괄호(`()`), 대괄호(`[]`), 슬래시(`/`) 등 특수문자가 포함된 노드 라벨은 반드시 큰따옴표(`id["Label (Extra Info)"]`)로 감쌉니다.
- 노드 라벨 내부에 HTML 태그(`<br/>` 등)를 넣지 않고 `\n` 또는 간결한 문구를 사용합니다.
- 지원 유형(`flowchart TD/LR`, `sequenceDiagram`, `stateDiagram-v2`, `classDiagram`, `erDiagram`, `xychart-beta`)만 사용합니다.

### ② 커스텀 반응형 SVG 도식 (라벨이 필요한 구조도·구성도)
텍스트 없는 AI 일러스트로는 전달할 수 없고 `Mermaid`만으로는 레이아웃 표현이 아쉬운 **메모리/스레드 구조도, Before/After 아키텍처 비교, 제품 연결 구성도** 등은 MDX 본문 내 `<figure class="not-prose my-6">` 안에 깔끔한 인라인 SVG로 직접 작성할 수 있습니다.
- 고정 픽셀 폭 대신 `viewBox="0 0 720 320"` + `class="w-full h-auto rounded-lg border border-border bg-card p-4"`로 모바일 반응형과 라이트/다크모드 호환성(`currentColor`, CSS 변수 또는 명도 대비가 확보된 색상)을 보장합니다.
- 하단에 `<figcaption class="mt-2 text-center text-sm text-muted-foreground">...</figcaption>`을 함께 달아 읽는 포인트를 안내합니다.

---

## 4. 기존 에셋 재사용 및 외부 실사·퍼블릭 도메인 인용 가이드

### ① 기존 Cloudinary 에셋 검색 (`search-assets`)
인물·기업·영화·기존 시리즈 주제를 다룰 때는 새 이미지를 생성하기 전에 `cloudinary` MCP의 `search-assets`로 계정 보유 에셋을 먼저 확인합니다:
```json
{
  "name": "search-assets",
  "arguments": {
    "request": {
      "expression": "resource_type:image AND (folder:media/* OR folder:library/*) AND ...",
      "max_results": 10
    }
  }
}
```

### ② 검증된 외부 원본 이미지 인용 기준 (저작권 안전 수칙)
실제 사료·역사적 유물·성화·지리 풍경·공식 기술 도표가 필요할 때는 아래 라이선스가 확인된 원본만 사용합니다:
1. **퍼블릭 도메인(Public Domain) / CC0**: 저작권 만료 고전 회화·역사 사진·Wikimedia Commons Public Domain 자료
2. **크리에이티브 커먼즈 저작자 표시(CC BY / CC BY-SA)**: 원저작자명·라이선스·원본 링크를 `credit` 및 `creditUrl`에 정확히 명시
3. **공식 기술 문서·오픈소스 리포지토리(MIT/Apache 등)·공식 프레스킷**: 출처 기관/문서명과 원본 URL을 `credit` 및 `creditUrl`에 명시
- **금지**: 출처 불명 블로그/뉴스 기사 무단 전재, 워터마크가 박힌 유료 스톡 이미지(Getty, Shutterstock 등) 사용 금지.

---

## 5. AI 이미지 생성 가이드 (`image-generator`)

`image-generator` 서브에이전트(`TypeName: "image-generator"`, `Role: "Visual Illustrator"`)는 워크스페이스 `public/`을 오염시키지 않고 아티팩트 디렉터리에 이미지를 저장해 경로를 반환합니다.

### ① 대표 썸네일 프롬프트 템플릿 (`16:9`, 전 포스트 필수 1장)
```text
다음 블로그 포스트의 16:9 와이드 대표 썸네일 이미지를 생성해줘:
- 핵심 소재: [포스트 주제를 직관적으로 드러내는 구체적 중심 오브젝트/장면]
- 분위기: 모던하고 정돈된 에디토리얼 일러스트 또는 그래픽, 명확한 초점과 깊이감 있는 조명
- 제약사항: 이미지 내부에 텍스트, 글자, 알파벳, 한글, 숫자, 워터마크를 넣지 말 것.
```

### ② 본문 이미지 4대 적합 유형 및 프롬프트 템플릿 (필요 시 0～N장 자유 생성)
막연한 추상 은유 대신 **본문에 실제로 등장하는 구체적 대상**을 묘사할 때만 호출합니다. (깨진 글자 방지를 위해 이미지 내부 텍스트·라벨은 배제하고, 설명은 `<CloudinaryImage caption="..." />`에서 처리합니다.)

1. **절기 · 역사 · 문화 · 일상 사물/장면 (`life`, `culture`)**
   - *예시 소재*: 크리스마스 포스트의 성탄 트리와 따뜻한 예배당 내부·아기 예수 구유 성화풍 장면, 대림절의 4개 초가 켜진 전나무 리스, 중세 성극 무대의 사과 달린 낙원 나무 등
   ```text
   블로그 본문의 '[구체적 설명 대상]' 이해를 돕는 이미지를 생성해줘:
   - 묘사할 구체적 대상/장면: [예: 아기 예수가 누운 구유와 말구유 등불, 혹은 성탄 전야 촛불이 밝혀진 고즈넉한 석조 교회 내부와 크리스마스 트리]
   - 스타일: 주제의 시대적·계절적 분위기가 살아 있는 따뜻하고 디테일한 일러스트레이션
   - 제약사항: 추상적 기호나 글자/숫자/워터마크 없이 실제 장면과 사물의 디테일에 집중할 것.
   ```

2. **제품 · 하드웨어 · 공간 구성도 (`money`, `tools`, `dev`)**
   - *예시 소재*: 제품 패키지/부품 분해 구성도(Exploded/Knolling layout), 데스크 셋업·케이블 연결 배치도, 수조 여과기 물 순환 단면도 등
   ```text
   '[제품/시스템명]'의 구조와 구성을 한눈에 파악할 수 있는 깔끔한 구성도 이미지를 생성해줘:
   - 표현할 구성 요소와 배치: [예: 본체, 전원 어댑터, 입출력 연결 구조 또는 단면 내부 흐름이 정돈되게 나열/연결된 모습]
   - 스타일: 아이소메트릭(Isometric) 또는 정갈한 테크니컬 다이나믹 도해(Cutaway / Knolling 스타일), 밝고 시인성 높은 배경
   - 제약사항: 이미지 안에 깨지기 쉬운 텍스트 라벨·숫자는 넣지 말고 시각적 형태와 연결선·색상 대비로 구조를 명확히 보여줄 것.
   ```

3. **인물 캐리커처 · 에디토리얼 포트레이트 (`money`, `culture`, `dev`)**
   - *예시 소재*: 월가 투자 대가, 영화 감독·창작자, 역사적 인물이나 오픈소스 창시자의 특징과 대표적 배경 소품을 살린 위트 있는 캐리커처
   ```text
   본문에서 다루는 '[인물명 / 인물 특징]'을 표현한 에디토리얼 캐리커처 일러스트를 생성해줘:
   - 인물 특징 및 상징 소품: [인물의 대표적 외형 특징, 표정, 시그니처 안경/복장 및 관련 배경 오브젝트]
   - 스타일: 뉴요커(The New Yorker)·이코노미스트 매거진 칼럼 스타일의 세련되고 개성 있는 에디토리얼 캐리커처/포트레이트
   - 제약사항: 말풍선, 텍스트, 이름표, 숫자, 워터마크 금지.
   ```

4. **여행지 · 명소 · 공간 풍경 (`culture`, `life`)**
   - *예시 소재*: 해당 여행지·건축물·계절 거리의 실제 지형과 현장 공기를 상기시키는 풍경
   ```text
   독자가 '[여행지/장소명]'의 현장 분위기를 생생하게 떠올릴 수 있는 풍경 이미지를 생성해줘:
   - 장소의 핵심 풍경 요소: [특징적인 건축물 실루엣, 지형, 계절감, 시간대 조명, 거리/자연 디테일]
   - 스타일: 현장감과 공기감이 살아 있는 세밀한 풍경화 또는 사실적인 에디토리얼 트래블 아트
   - 제약사항: 간판 글자, 텍스트, 워터마크 없이 풍경과 공간감에 집중할 것.
   ```

---

## 6. Cloudinary MCP 업로드 및 MDX 삽입 규격

이 프로젝트는 전역 `cloudinary` MCP 서버(`@cloudinary/asset-management-mcp`, `--mode dynamic`, Cloud Name: `doal3ofyr`)와 연동되어 있습니다.

### ① 폴더 및 네이밍 컨벤션
- **포스트 전용 폴더 경로**: `posts/{섹션}/{연도}/{slug}` (예: `posts/life/2026/christmas-origins`)
- **파일 식별자(`public_id` 단말명)**:
  - 대표 썸네일: `thumbnail`
  - 본문 이미지(있을 경우): `fig-01-{영문키워드}`, `fig-02-{영문키워드}` (예: `fig-01-nativity-manger`, `fig-02-paradise-tree`)

### ② MCP 업로드 호출 방법 (`file://` 로컬 파일 및 `https://` 외부 원본 URL 모두 지원)
1. 세션 내 첫 호출 시 `call_mcp_tool` (`ServerName: "cloudinary"`, `ToolName: "describe_tool_input"`, `Arguments: { "tool_names": ["upload-asset"] }`)로 입력 스키마를 확인합니다.
2. `execute_tool`로 `upload-asset`을 실행합니다:
   ```json
   {
     "name": "upload-asset",
     "arguments": {
       "resource_type": "image",
       "upload_request": {
         "file": "file:///Users/.../brain/.../generated-image.jpg",
         "folder": "posts/life/2026/christmas-origins",
         "public_id": "fig-01-nativity-manger",
         "overwrite": true
       }
     }
   }
   ```
   - **로컬 생성 이미지**: `"file": "file:///절대경로"` (`file://` 접두사 필수)
   - **외부 퍼블릭 도메인·공식 자료 이미지**: `"file": "https://upload.wikimedia.org/..."`처럼 검증된 원격 이미지 직접 URL을 그대로 전달하면 터미널 다운로드 없이 Cloudinary로 즉시 수집됩니다.
   - `folder`를 지정했으므로 `public_id`에는 폴더 경로를 중복 기입하지 않고 단말 파일명만 적으며, 업로드 응답 JSON의 **`public_id`(전체 경로 포함), `width`, `height` 값을 그대로 MDX에 반영**합니다.

### ③ Frontmatter 및 본문 MDX 반영 규격 (캡션 & 본문 연동 필수)

1. **대표 썸네일 (`thumbnail` frontmatter)**
   - 메신저 OG 크롤러 호환성을 위해 반드시 **`w_1200,q_auto,f_jpg`** 변환을 명시합니다:
   ```yaml
   thumbnail: "https://res.cloudinary.com/doal3ofyr/image/upload/w_1200,q_auto,f_jpg/posts/life/2026/christmas-origins/thumbnail"
   ```

2. **본문 단일 이미지 (`CloudinaryImage.astro` — `caption` 필수 권장)**
   - CLS 방지용 `width`·`height`, 접근성용 `alt`와 함께 **독자가 이미지에서 무엇을 봐야 하는지 짚어주는 `caption`**을 반드시 작성합니다. 외부 자료 인용 시에는 `credit`과 `creditUrl`을 함께 기입합니다:
   ```mdx
   import CloudinaryImage from '@/components/CloudinaryImage.astro';

   <!-- AI 생성 구체 묘사 / 자체 제작 구성도 -->
   <CloudinaryImage
     publicId="posts/life/2026/christmas-origins/fig-01-paradise-tree"
     width={1376}
     height={768}
     alt="중세 독일 12월 24일 성극 무대에 세워진 사과와 성체 과자를 매단 전나무 낙원 나무"
     caption="중세 독일 아담과 하와 성극 무대의 '낙원 나무' — 붉은 사과와 성체 과자 장식이 오늘날 크리스마스 트리 오너먼트의 시초가 됐다."
   />

   <!-- 외부 퍼블릭 도메인·공식 레퍼런스 인용 시 -->
   <CloudinaryImage
     publicId="posts/life/2026/advent-meaning-and-wreath-guide/fig-01-wichern-wreath"
     width={1200}
     height={800}
     alt="요한 힌리히 비헤른 목사가 고안한 마차 바퀴 형태의 초기 대림환"
     caption="주일마다 켜는 큰 흰 초 4개와 평일용 작은 빨간 초들로 구성된 비헤른형 대림환"
     credit="Wikimedia Commons, CC BY-SA 3.0"
     creditUrl="https://commons.wikimedia.org/wiki/..."
   />
   ```

3. **본문 다중 비교·연속 이미지 (`ImageRow.astro` + `CloudinaryImage.astro`)**
   - 2～4장의 Before/After 도해나 여행 동선·연속 사진은 `<ImageRow>`로 묶고 공통 `caption`을 지정합니다 (개별 하위 `<CloudinaryImage>`의 `caption`은 생략하거나 짧은 구분 라벨만 사용):
   ```mdx
   import ImageRow from '@/components/ImageRow.astro';
   import CloudinaryImage from '@/components/CloudinaryImage.astro';

   <ImageRow cols={2} caption="좌: 초기 판지에 오려 붙이던 1908년 인쇄 달력 / 우: 1920년대 등장한 여닫이 창문형 어드벤트 캘린더">
     <CloudinaryImage
       publicId="posts/life/2026/advent/fig-01-cutout"
       width={1024}
       height={1024}
       alt="그림 조각을 가위로 오려 판지에 붙이는 초기 어드벤트 달력"
     />
     <CloudinaryImage
       publicId="posts/life/2026/advent/fig-02-doors"
       width={1024}
       height={1024}
       alt="숫자가 적힌 작은 종이 창문을 여는 방식의 어드벤트 캘린더"
     />
   </ImageRow>
   ```

---

## 7. 오프라인/외부 툴 폴백

네트워크 제한 등으로 Cloudinary 업로드를 수행할 수 없는 예외적인 상황에서만 로컬 `public/images/posts/{연도}/{slug}-thumbnail.{ext}` 복사를 폴백으로 사용하거나, 사용자가 직접 외부 툴로 생성하길 원할 때 구조화된 프롬프트를 제공합니다.
