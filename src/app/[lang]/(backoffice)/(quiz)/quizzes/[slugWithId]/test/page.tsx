import QuizTakingClient from "./QuizTakingClient";
import { Quiz } from "@/app/feature/quiz/quiz";
type Props = {
    params: Promise<{ slugWithId: string }>;
};
export default async function Page(props: Props) {
    const { slugWithId } = await props.params;
    const lastDash = slugWithId.lastIndexOf("-")
    const id = slugWithId.slice(lastDash + 1)

    // Demo mock data
    const mockQuiz: Quiz = {
        id: id,
        title: "Kiểm tra kiến thức Frontend React & Next.js",
        duration: 15, // minutes
        status: "publish",
        questions: [
            {
                id: "q1",
                content: "React là gì?",
                type: "single_choice",
                point: 10,
                answers: [
                    { id: "a1", content: "Một framework cho Mobile", isCorrect: false },
                    { id: "a2", content: "Một thư viện JavaScript để xây dựng giao diện người dùng", isCorrect: true },
                    { id: "a3", content: "Một hệ quản trị cơ sở dữ liệu", isCorrect: false },
                    { id: "a4", content: "Một ngôn ngữ lập trình mới", isCorrect: false },
                ],
                status: "done"
            },
            {
                id: "q2",
                content: "Next.js hỗ trợ những phương thức Rendering nào?",
                type: "multiple_choice",
                point: 10,
                answers: [
                    { id: "a5", content: "SSR (Server Side Rendering)", isCorrect: true },
                    { id: "a6", content: "SSG (Static Site Generation)", isCorrect: true },
                    { id: "a7", content: "ISR (Incremental Static Regeneration)", isCorrect: true },
                    { id: "a8", content: "CSR (Client Side Rendering)", isCorrect: true },
                ],
                status: "done"
            },
            {
                id: "q3",
                content: "Hook nào được dùng để quản lý state trong Functional Component?",
                type: "single_choice",
                point: 10,
                answers: [
                    { id: "a9", content: "useEffect", isCorrect: false },
                    { id: "a10", content: "useContext", isCorrect: false },
                    { id: "a11", content: "useState", isCorrect: true },
                    { id: "a12", content: "useReducer", isCorrect: false },
                ],
                status: "done"
            },
            {
                id: "q4",
                content: "Thuộc tính 'key' trong list React dùng để làm gì?",
                type: "single_choice",
                point: 10,
                answers: [
                    { id: "a13", content: "Để làm đẹp code", isCorrect: false },
                    { id: "a14", content: "Để React xác định các item đã thay đổi, thêm hoặc xóa", isCorrect: true },
                    { id: "a15", content: "Để CSS dễ dàng hơn", isCorrect: false },
                    { id: "a16", content: "Không bắt buộc", isCorrect: false },
                ],
                status: "done"
            },
            {
                id: "q5",
                content: "Server Component trong Next.js App Router chạy ở đâu?",
                type: "single_choice",
                point: 10,
                answers: [
                    { id: "a17", content: "Ở trình duyệt", isCorrect: false },
                    { id: "a18", content: "Ở Server", isCorrect: true },
                    { id: "a19", content: "Cả ở Server và Browser", isCorrect: false },
                    { id: "a20", content: "Ở database", isCorrect: false },
                ],
                status: "done"
            }
        ]
    };

    return (
        <main className="min-h-screen bg-surface-0 transition-colors duration-300">
            <div className="max-w-7xl mx-auto pt-10 px-4 text-left">
                <h1 className="text-2xl font-bold text-primary mb-2 truncate">{mockQuiz.title}</h1>
                <p className="text-secondary mb-8">Vui lòng hoàn thành câu hỏi trước khi hết thời gian.</p>
            </div>
            <QuizTakingClient quiz={mockQuiz} />
        </main>
    );
}
