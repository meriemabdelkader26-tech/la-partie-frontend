import React from "react";

interface UpdateFormCategoryProps {
	categoryId: string;
	category: any;
}

const UpdateFormCategory: React.FC<UpdateFormCategoryProps> = ({ categoryId, category }) => {
	return (
		<form className="space-y-4 p-6 rounded-lg" style={{ background: '#22C55E' }}>
			<div>
				<label className="block text-sm font-medium text-black mb-1">Category ID</label>
				<input
					type="text"
					value={categoryId}
					disabled
					className="w-full px-3 py-2 rounded bg-white text-black border border-slate-600"
				/>
			</div>
			<div>
				<label className="block text-sm font-medium text-black mb-1">Category Name</label>
				<input
					type="text"
					value={category?.name || ''}
					disabled
					className="w-full px-3 py-2 rounded bg-white text-black border border-slate-600"
				/>
			</div>
			{/* Add more fields as needed */}
			<button type="submit" className="bg-black text-white px-4 py-2 rounded">Update</button>
		</form>
	);
};

export default UpdateFormCategory;
