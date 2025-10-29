export default async function UserProfile({params}: {params: Promise<{id: string}>}) {
    const { id } = await params;//? this will return a promise
    
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-6 text-center">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Profile</h1>
                <hr className="border-gray-200 dark:border-gray-700" />
                <p className="text-7xl font-semibold text-blue-600 dark:text-blue-400">{id}</p>
            </div>
        </div>
    );
}



