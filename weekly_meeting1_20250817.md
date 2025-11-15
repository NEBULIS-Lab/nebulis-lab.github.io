# Group Meeting Notes (17 Aug 2025)

**Date**: August 17, 2025  
**Time**: 10:30–11:30 AM
**Location**: W4–542
**Mode**: In-person
**Chair**: Prof. Su
**Note-taker**: Shuaijun Liu  
**Participants**:  
- Xingwei Chen
- Feiyang You
- Qingkai Yang
- Xuan Qiu
- Shuaijun Liu 

## Meeting Arrangement
- **Frequency**: Weekly  
- **Mode**: In-person preferred; online possible upon request if special situations arise  
- **Time**: To be decided after course schedules are released  

## Weekly Updates
- **Format**: Email to supervisor  
- **Type**: Personal (each student submits individually)  
- **Timing**: Fixed time each week, flexible if necessary  
- **Note**: don‘t use LLMs for writing updates (practice English)  
- Students may schedule one-on-one meetings with the supervisor if needed  

## Work Expectations
- achieve 40 hours per week  
- Preferably work at W4–5th floor

## Task Assignments
- **Xingwei**: Address questions/issues regarding new student enrolling
- **Shuaijun**: Draft PhD mission/timetable  
- **Feiyang**: Share valuable papers on the GitHub repository  

## Research Project Setup (via GitHub, Rebato)
- **Repository Naming**: `<Name>-<Conference><Year>-<Type (paper/code)>`  , eg, `qingkai-iclr26-paper`
- **.gitignore**: Add according to programming language  
- **README**: Include project description, target deadlines, and abstract submission  
- write clear 1.Abstract ddl (registration  time). 2. Target ddl: final submission

### Commit Messages
- Format: `v.<verb> <file name>`  
- **Results**: Multiple commits for results/processing  
- **Environment**: Record using `.yml` file  
- **Figures**: Save source data; suggested tool: *draw.io*  


## Paper Writing in LaTeX
1. Write paper in **VS Code** (local) and sync with GitHub  
2. GitHub: Use **revert** cautiously (not recommended for frequent edits)  
3. Start with `main.tex` and include sections with `\input{}`  
4. Use **Makefile** for compilation management  