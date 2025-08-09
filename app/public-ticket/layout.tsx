export default function PublicTicketLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="bg-gray-50">
                {children}
            </body>
        </html>
    );
}
