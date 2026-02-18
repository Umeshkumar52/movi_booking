import os

def fix_modal(file_path, old_pattern, new_pattern, old_closing, new_closing):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Add useEffect if not present
    use_effect_code = """  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);\n\n"""
    
    # We'll just replace the patterns
    new_content = content.replace(old_pattern, use_effect_code + new_pattern)
    new_content = new_content.replace(old_closing, new_closing)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

# SeasonForms.jsx
season_path = r'c:\Users\91750\OneDrive\Desktop\Movi_Booking\frontend\src\Components\seriesForms\SeasonForms.jsx'
old_season_wrapper = '    <div className="fixed inset-0 z-[1100] bg-slate-950/90 backdrop-blur-sm overflow-y-auto">\n      <div className="flex min-h-full items-center justify-center p-4">\n        <div className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">'
new_season_wrapper = '    <div className="fixed inset-0 z-[1200] bg-slate-950/90 backdrop-blur-sm">\n      <div className="hide-scrollbar w-full h-full overflow-y-auto">\n        <div className="flex min-h-full items-center justify-center py-16 px-4">\n          <div className="relative w-full max-w-2xl bg-slate-900 border border-white/10 shadow-2xl rounded-[2.5rem] animate-in fade-in zoom-in-95 duration-300 overflow-hidden">'
old_season_closing = '        </div>\n      </div>\n    </div>'
new_season_closing = '          </div>\n        </div>\n      </div>\n    </div>'

# EpisodeForms.jsx
episode_path = r'c:\Users\91750\OneDrive\Desktop\Movi_Booking\frontend\src\Components\seriesForms\EpisodeForms.jsx'
old_episode_wrapper = '    <div className="fixed inset-0 z-[1100] bg-slate-950/90 backdrop-blur-sm overflow-y-auto">\n      <div className="flex min-h-full items-center justify-center p-4">\n        <div className="w-full max-w-3xl bg-slate-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">'
new_episode_wrapper = '    <div className="fixed inset-0 z-[1200] bg-slate-950/90 backdrop-blur-sm">\n      <div className="hide-scrollbar w-full h-full overflow-y-auto">\n        <div className="flex min-h-full items-center justify-center py-16 px-4">\n          <div className="relative w-full max-w-3xl bg-slate-900 border border-white/10 shadow-2xl rounded-[2.5rem] animate-in fade-in zoom-in-95 duration-300 overflow-hidden">'

# Run replacements
# For SeasonForms.jsx
with open(season_path, 'r', encoding='utf-8') as f:
    content = f.read()

# I'll use a more flexible way to find the return and replace it
import re

def standardize_file(path, wrapper_class_old, wrapper_class_new, form_max_width):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all "return (" and replace until first div structure
    # This is tricky because of multiple components.
    
    # Let's try to match the exact return blocks
    return_block_regex = r'return \(\s+<div className="fixed inset-0 z-\[1100\].*?>\s+<div className="flex min-h-full items-center justify-center p-4">\s+<div className="w-full max-w-(2|3)xl bg-slate-900 border border-white/10 rounded-\[2\.5rem\] overflow-hidden shadow-2xl">'
    
    def replace_return(match):
        width = match.group(1)
        return f'useEffect(() => {{\n    document.body.style.overflow = "hidden";\n    return () => {{\n      document.body.style.overflow = "unset";\n    }};\n  }}, []);\n\n  return (\n    <div className="fixed inset-0 z-[1200] bg-slate-950/90 backdrop-blur-sm">\n      <div className="hide-scrollbar w-full h-full overflow-y-auto">\n        <div className="flex min-h-full items-center justify-center py-16 px-4">\n          <div className="relative w-full max-w-{width}xl bg-slate-900 border border-white/10 shadow-2xl rounded-[2.5rem] animate-in fade-in zoom-in-95 duration-300 overflow-hidden">'
    
    new_content = re.sub(return_block_regex, replace_return, content)
    
    # Fix closing divs: change 3 </div>s to 4 </div>s
    # Only if they are followed by ); and reside within the components.
    # Looking for:
    #         </div>
    #       </div>
    #     </div>
    #   );
    
    closing_regex = r'        </div>\s+</div>\s+</div>\s+\);\s+'
    new_closing = '          </div>\n        </div>\n      </div>\n    </div>\n  );\n'
    new_content = re.sub(closing_regex, new_closing, new_content)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)

standardize_file(season_path, 'z-[1100]', 'z-[1200]', '2xl')
standardize_file(episode_path, 'z-[1100]', 'z-[1200]', '3xl')

print("Replacement complete.")
