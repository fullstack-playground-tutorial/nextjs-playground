export default function QuizGroupLayout({
    children,
    quizModal,
}: {
    children: React.ReactNode;
    quizModal: React.ReactNode;
}) {
    return (
        <>
            {children}
            {quizModal}
        </>
    );
}
