export default async function Layout({
    children,
    interests,
}: {
    interests: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
            {interests}
        </>
    );
}
