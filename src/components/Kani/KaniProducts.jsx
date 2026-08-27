import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import axios from 'axios';
import DefaultLayout from "../../layout/DefaultLayout";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { VIEW_ALL_PRODUCT_SUBGROUP_URL, PRODUCTCOUNT_URL } from "../../Constants/utils";

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
  const [productCounts, setProductCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

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
        // note: "By material",
        keywords: ["fabric"]
      },
      "Garments": {
        items: [],
        // note: "Finished, wearable pieces",
        keywords: ["garment", "garments", "apparel", "clothing"]
      },
      "Fiber & yarn": {
        items: [],
        // note: "Raw material stage",
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
          // Add count from the counts API (matched by productGroupName)
          const productWithCount = {
            ...product,
            count: productCounts[product.productGroupName] || 0
          };
          category.items.push(productWithCount);
          categorized = true;
          break;
        }
      }

      // If no category matched, put in "Weave & embroidery styles" as default
      if (!categorized) {
        const productWithCount = {
          ...product,
          count: productCounts[product.productGroupName] || 0
        };
        categories["Weave & embroidery styles"].items.push(productWithCount);
      }
    });

    // Filter out empty categories
    return Object.fromEntries(
      Object.entries(categories).filter(([_, data]) => data.items.length > 0)
    );
  };

  // Fetch product groups and counts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch product groups
        const productResponse = await axios.get(VIEW_ALL_PRODUCT_SUBGROUP_URL, {
          headers: {
            'Authorization': `Bearer ${currentUser?.token}`
          }
        });

        // Fetch product counts using the PRODUCTCOUNT_URL from utils
        const countResponse = await axios.get(PRODUCTCOUNT_URL, {
          headers: {
            'Authorization': `Bearer ${currentUser?.token}`
          }
        });

        // Convert counts array to object with tableName as key
        const countsMap = {};
        if (Array.isArray(countResponse.data)) {
          countResponse.data.forEach(item => {
            if (item.tableName) {
              countsMap[item.tableName] = item.count || 0;
            }
          });
        }

        setProductGroups(productResponse.data);
        setProductCounts(countsMap);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.response?.data?.message || "Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.token) {
      fetchData();
    } else {
      setLoading(false);
      setError("User not authenticated. Please login.");
    }
  }, [currentUser]);

  // Filter products based on search
  const filteredProducts = productGroups.filter(product => 
    product.productGroupName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Categorize filtered products
  const categorizedProducts = useMemo(() => {
    return categorizeProducts(filteredProducts);
  }, [filteredProducts, productCounts]);

  // Get total count for a category
  const getCategoryTotalCount = (items) => {
    return items.reduce((total, item) => total + (item.count || 0), 0);
  };

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

  if (error) {
    return (
      <DefaultLayout>
        <Breadcrumb pageName="Kani Orders" />
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500 text-center">
            <p className="text-lg font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
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
       
        </div>

        {/* Categories with Sections */}
        {Object.entries(categorizedProducts).map(([categoryName, categoryData]) => {
          const styles = getCategoryStyles(categoryName);
          const categoryTotal = getCategoryTotalCount(categoryData.items);
          
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
                {categoryData.items.map((product) => {
                  const count = product.count || 0;
                    
                  return (
                    <Link 
                      to={`/ProductGroupDetails/${product.id}?name=${encodeURIComponent(product.productGroupName)}`} 
                      key={product.id}
                      className="block"
                    >
                      <div className="p-card bg-white border border-[#E3E7F1] rounded-[12px] p-5 text-center flex flex-col items-center gap-2 cursor-pointer transition-all hover:border-[#9AA1BE] hover:-translate-y-[1px] shadow-[0_1px_2px_rgba(27,33,64,0.04)] relative">
                        <div className={`p-icon w-[38px] h-[38px] rounded-[10px] flex items-center justify-center ${styles.iconBg} ${styles.iconColor}`}>
                          {getIconForProduct(product.productGroupName, categoryName)}
                        </div>
                        <div className="p-name text-[11.5px] font-semibold uppercase leading-tight text-[#1B2140] tracking-[0.02em]">
                          {product.productGroupName}
                        </div>
                        
                        {/* Show count as a number - always show 0 if no orders */}
                        <div className={`text-lg font-bold mt-1 ${count > 0 ? 'text-[#1F7A6C]' : 'text-[#9AA1BE]'}`}>
                          {count}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {Object.keys(categorizedProducts).length === 0 && (
          <div className="text-center py-12">
            <div className="text-[#666F94] text-sm">
              {searchTerm ? "No product groups found matching your search" : "No product groups found"}
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default KaniProducts;