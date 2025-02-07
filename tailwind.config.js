/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // theme: {
  //   extend: {
  //     colors: {
  //       background: '#FFF9F9', 
  //       heading: '#7B1984', 
  //       primary: '#000000', 
  //       secondary: '#2F2F2F', 
  //       success: '#00B894', 
  //       warning: '#FFC107', 
  //       error: '#FF5733', 
  //       info: '#00BFFF', 
  //     },
  //     fontFamily: {
  //       urbanist: ['Urbanist', 'sans-serif'],
  //     },
  //   },
  // },
  theme: {
    extend: {
      colors: {
        bg_light: "#FFF9F9",//login page color 
        bg_secondary:"#F1F1F1", //form footer bg & 
        // background_dark: "#231F20",
        text_primary: "#000000", // text color 
        text_secondary: "#2F2F2F",//login page color & grey text colors 
        text_heading: "#2F2F2F", // color 
        table_heading:"rgba(0, 0, 0, 0.60)", // color 
        cell_status_bg:"rgba(0, 0, 0, 0.60)", // color 

        todo_purple: "#FAC3FF",// todo section header color  
        in_progress_blue: "#85D9F1",// InProgress section header color 
        completed_green: "#CEFFCC",// completed section header color  
        form_input_bg: "'rgba(241, 241, 241, 0.36)'",// 
        input_border: "rgba(0, 0, 0, 0.13)",// color 
        btn_primary: "#7B1984",// color 
        btn_primary_text: "#DDDDDD",// color 
        btn_secondary: "#DDDDDD",// color 
        btn_secondary_border: "rgba(0, 0, 0, 0.13)",// border color of white btn 
        accent_red: "#DA2F2F",// delete button color 
        accent_green: "#0D7A0A",// kanban success color 
        border_gray: "#DDD",// color 
        hover_bg: "#B1B1B2",// color 
        
      },
      // Font Sizes
      fontSize: {
        xs: '12px', // filter by, logout, filter text, dropdowns & childs, 
        sm: '14px', // all text Small
        default:'15px', // no data found font size
        base: '16px',
        heading: '24px', // tab text font size
      },
      fontFamily: {
        urbanist: ['Urbanist', 'sans-serif'],
        Mulish:['Mulish' , 'sans-serif']
      },
       // Border Radius
       borderRadius: {
        none: '0',
        sm: '4px', // Small border radius
        Default: '8px', // inputs, attacgments section, 
        md: '12px', //kanban border radius, list view section radius, dropdown items, calendar, logout button, 
        lg: '16px', // Large radius for cards, modals, etc.
        xl:'20px', // 
        corner:'40px', //rounded buttons , chips, 
      },
    },
  },
  plugins: [

    function ({ addComponents }) {
      addComponents({
        '.custom-scrollbar': {
          '::-webkit-scrollbar': {
            width: '6px',
          },
          '::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(241, 241, 241, 0.36)',
            borderRadius: '10px',
          },
          '::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
          },
        },
      });
    },
  ],
}