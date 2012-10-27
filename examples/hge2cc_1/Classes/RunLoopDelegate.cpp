//
//  RunLoopDelegate.cpp
//  hybridge
//
//  Created by The Narrator on 10/27/12.
//
//

#include "RunLoopDelegate.h"
#include "dev/HGEPlatformMacros.h"
#include "platform/nacl/hybrid/CCHybridEGLView.h"
#include "cocos2d.h"

USING_NS_HGE;
USING_NS_CC;

RunLoopDelegate::RunLoopDelegate(pp::Instance* instance) : HGEPlatformRunLoop(instance)
{
}

RunLoopDelegate::~RunLoopDelegate()
{
}

void RunLoopDelegate::begin()
{
	HGERunLoop::sharedRunLoop()->setInterval(1.0 / 60);
	
    CCApplication::sharedApplication()->run();
}

void RunLoopDelegate::update()
{
	cocos2d::CCDirector::sharedDirector()->mainLoop();
}

void RunLoopDelegate::present()
{
	pp::CompletionCallback cc = m_obFactory.NewCallback(&HGEPlatformRunLoop::threadCycle);
	CCHybridEGLView::sharedHybridOpenGLView()->hybridPresentation(cc);
	//[[EAGLView sharedEGLView] hybridPresentation];
}


