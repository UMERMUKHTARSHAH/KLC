import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import axios from 'axios';
import DefaultLayout from "../../layout/DefaultLayout";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { VIEW_ALL_PRODUCT_SUBGROUP_URL } from "../../Constants/utils";

// Get icon for product
const getIconForProduct = (productName, category) => {
  const name = productName?.toLowerCase() || "";
  
  // Default icon for Weave & embroidery styles
  if (category === "Weave & embroidery styles") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[19px] h-[19px]">
        <path d="M4 4h13a3 3 0 013 3v13H7a3 3 0 01-3-3z"/>
        <path d="M4 4a3 3 0 000 6"/>
        <path d="M8 9h8M8 13h5"/>
      </svg>
    );
  }
  
  // Fabric icons
  if (category === "Fabric") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[19px] h-[19px]">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18M9 3v18"/>
      </svg>
    );
  }
  
  // Garments icons
  if (category === "Garments") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[19px] h-[19px]">
        <path d="M8 3l4 2 4-2 4 4-3 3v11H7V10L4 7z"/>
      </svg>
    );
  }
  
  // Fiber & yarn icons
  if (category === "Fiber & yarn") {
    if (name.includes("paper mache")) {
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[19px] h-[19px]">
          <path d="M12 3c-3 3-7 5-7 10a7 7 0 0014 0c0-5-4-7-7-10z"/>
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[19px] h-[19px]">
        <circle cx="12" cy="12" r="8"/>
        <path d="M6 8c3 2 3 6 0 8M12 5c3 3 3 11 0 14M18 8c-3 2-3 6 0 8"/>
      </svg>
    );
  }
  
  // Default
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[19px] h-[19px]">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M3 9h18M9 3v18"/>
    </svg>
  );
};

// Get category styles
const getCategoryStyles = (category) => {
  switch(category) {
    case "Weave & embroidery styles":
      return { iconBg: "bg-[#F5F7FB]", iconColor: "text-[#666F94]" };
    case "Fabric":
      return { iconBg: "bg-[#E6F3F0]", iconColor: "text-[#1F7A6C]" };
    case "Garments":
      return { iconBg: "bg-[#EFEDFB]", iconColor: "text-[#6C5CE0]" };
    case "Fiber & yarn":
      return { iconBg: "bg-[#FAEDE6]", iconColor: "text-[#C9714B]" };
    default:
      return { iconBg: "bg-[#F5F7FB]", iconColor: "text-[#666F94]" };
  }
};

const KaniProducts = () => {
  const { currentUser } = useSelector((state) => state?.persisted?.user || {});
  const [productGroups, setProductGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Categorize products based on productGroupName
 
// const categorizeProducts = (products) => {
//   const categories = {
//     "Weave & embroidery styles": {
//       items: [],
//       note: "Finished-technique categories"
//     },
//     "Fabric": {
//       items: [],
//       note: "By material"
//     },
//     "Garments": {
//       items: [],
//       note: "Finished, wearable pieces"
//     },
//     "Fiber & yarn": {
//       items: [],
//       note: "Raw material stage"
//     }
//   };

//   products.forEach(product => {
//     const name = product.productGroupName?.toLowerCase() || "";
    
//     // Check for Fabric - includes Fabric Wool, Fabric Pashmina, Fabric Cotton
//     if (name.includes("fabric")) {
//       categories["Fabric"].items.push(product);
//     } 
//     // Check for Garments
//     else if (name.includes("garment")) {
//       categories["Garments"].items.push(product);
//     } 
//     // Check for Fiber & yarn
//     else if (name.includes("paper mache") || 
//              name.includes("fiber / yarn") || 
//              name.includes("fiber/yarn")) {
//       categories["Fiber & yarn"].items.push(product);
//     } 
//     // Everything else goes to Weave & embroidery styles
//     else {
//       categories["Weave & embroidery styles"].items.push(product);
//     }
//   });

//   // Filter out empty categories
//   return Object.fromEntries(
//     Object.entries(categories).filter(([_, data]) => data.items.length > 0)
//   );
// };


// Categorize products based on productGroupName with flexible keyword matching
const categorizeProducts = (products) => {
  const categories = {
    "Weave & embroidery styles": {
      items: [],
      note: "Finished-technique categories",
      keywords: ["contemporary", "pashmina embroidery", "kani", "wool embroidery", "ari", "sozni", "plain pashmina", "cotton", "saree"]
    },
    "Fabric": {
      items: [],
      note: "By material",
      keywords: ["fabric"]
    },
    "Garments": {
      items: [],
      note: "Finished, wearable pieces",
      keywords: ["garment", "garments", "apparel", "clothing"]
    },
    "Fiber & yarn": {
      items: [],
      note: "Raw material stage",
      keywords: ["fiber", "yarn", "paper mache", "fibre", "thread"]
    }
  };

  products.forEach(product => {
    const name = product.productGroupName?.toLowerCase() || "";
    let categorized = false;

    // Check each category in order of priority
    const categoryOrder = ["Fabric", "Garments", "Fiber & yarn", "Weave & embroidery styles"];
    
    for (let categoryName of categoryOrder) {
      const category = categories[categoryName];
      if (!category) continue;
      
      // Check if product name contains any keyword from this category
      const matchesKeyword = category.keywords.some(keyword => 
        name.includes(keyword.toLowerCase())
      );
      
      if (matchesKeyword) {
        category.items.push(product);
        categorized = true;
        break;
      }
    }

    // If no category matched, put in "Weave & embroidery styles" as default
    if (!categorized) {
      categories["Weave & embroidery styles"].items.push(product);
    }
  });

  // Filter out empty categories
  return Object.fromEntries(
    Object.entries(categories).filter(([_, data]) => data.items.length > 0)
  );
};

  // Fetch product groups from API
  useEffect(() => {
    const fetchProductGroups = async () => {
      try {
        setLoading(true);
        const response = await axios.get(VIEW_ALL_PRODUCT_SUBGROUP_URL, {
          headers: {
            'Authorization': `Bearer ${currentUser?.token}`
          }
        });
        
        const products = response.data;
        setProductGroups(products);
      } catch (error) {
        console.error("Error fetching product groups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductGroups();
  }, [currentUser]);

  // Filter products based on search
  const filteredProducts = productGroups.filter(product => 
    product.productGroupName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Categorize filtered products
  const categorizedProducts = categorizeProducts(filteredProducts);

  if (loading) {
    return (
      <DefaultLayout>
        <Breadcrumb pageName="Kani Orders" />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Kani Orders" />

      <div className="px-6 py-4" style={{ backgroundColor: '#EEF1F7' }}>
        {/* Page Header */}
        <div className="page-head pb-6">
          <div>
            <div className="eyebrow text-xs uppercase tracking-wider text-[#9AA1BE] font-semibold mb-2">
              Products / Product groups
            </div>
            <div className="headline font-sora text-2xl font-semibold text-[#1B2140]">
              Choose a product group
            </div>
            <div className="subline text-[#666F94] text-sm mt-1">
              Grouped by craft stage — pick one to see its orders.
            </div>
          </div>
          {/* <div className="search flex items-center gap-2 bg-white border border-[#E3E7F1] rounded-[10px] px-3 py-2 w-[260px]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[15px] h-[15px] text-[#9AA1BE] flex-shrink-0">
              <circle cx="11" cy="11" r="7"/>
              <path d="M21 21l-4.3-4.3"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search product groups"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-none outline-none text-sm w-full bg-transparent text-[#1B2140] placeholder:text-[#9AA1BE] font-inter"
            />
          </div> */}
        </div>

        {/* Categories with Sections */}
        {Object.entries(categorizedProducts).map(([categoryName, categoryData]) => {
          const styles = getCategoryStyles(categoryName);
          
          return (
            <div className="section mt-8" key={categoryName}>
              <div className="section-head flex items-baseline justify-between mb-3">
                <div className="section-title font-sora text-base font-semibold text-[#1B2140]">
                  {categoryName}
                </div>
                <div className="section-note text-xs text-[#9AA1BE] font-medium">
                  {categoryData.note}
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {categoryData.items.map((product) => (
                  <Link 
                    to={`/ProductGroupDetails/${product.id}?name=${encodeURIComponent(product.productGroupName)}`} 
                    key={product.id}
                    className="block"
                  >
                    <div className="p-card bg-white border border-[#E3E7F1] rounded-[12px] p-5 text-center flex flex-col items-center gap-3 cursor-pointer transition-all hover:border-[#9AA1BE] hover:-translate-y-[1px] shadow-[0_1px_2px_rgba(27,33,64,0.04)]">
                      <div className={`p-icon w-[38px] h-[38px] rounded-[10px] flex items-center justify-center ${styles.iconBg} ${styles.iconColor}`}>
                        {getIconForProduct(product.productGroupName, categoryName)}
                      </div>
                      <div className="p-name text-[11.5px] font-semibold uppercase leading-tight text-[#1B2140] tracking-[0.02em]">
                        {product.productGroupName}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {Object.keys(categorizedProducts).length === 0 && (
          <div className="text-center py-12">
            <div className="text-[#666F94] text-sm">No product groups found</div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default KaniProducts;